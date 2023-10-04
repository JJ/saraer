import { URIgenerator } from "../lib/uri_generator.ts";
import { router, ticket } from "../lib/routes.ts";
import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";

const aUriGenerator = new URIgenerator("https://test.data/test/");

Deno.test(
  "The ticket code should be generated correctly",
  async function testTicketRoute() {
    const ticketData = ["session-id", "talk-id"];
    const headers = new Headers();
    headers.set("user-agent", "test-user-agent");
    headers.set("accept", "test-accept");
    headers.set("accept-language", "test-accept-language");

    const ticketImg = await ticket(aUriGenerator, ticketData, headers);

    assertEquals(ticketImg.startsWith("data:image/gif;base64,"), true);
    const data = ticketImg.slice(22);
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    await Deno.writeFile("tests/test.gif", bytes);

    const qr_decoder = new Deno.Command("zbarimg", {
      args: ["tests/test.gif"],
    });
    const { code, stdout, stderr } = await qr_decoder.output();

    await Deno.remove("tests/test.gif");
    const decoder = new TextDecoder();

    assertEquals(code, 0);
    assertEquals(
      decoder
        .decode(stderr)
        .startsWith("scanned 1 barcode symbols from 1 images in"),
      true
    );
    const decodedOutput = decoder.decode(stdout);

    assertEquals(decodedOutput.startsWith("QR-Code:"), true);

    assertStringIncludes(decodedOutput, ticketData[0]);

    assertStringIncludes(decodedOutput, ticketData[1]);

    const digest = decodedOutput.split("/").pop();
    assertExists(digest);
  }
);

const ourRouter = router(aUriGenerator);

Deno.test("The router should return a 404 for an unknown route", async () => {
  const request = new Request("https://test.data/unknown-route");
  const response = await ourRouter(request);
  assertEquals(response.status, 404);
});

Deno.test("The router should return a ticket for a known route", async () => {
  const request = new Request("https://test.data/ticket/session-id/talk-id");
  const response = await ourRouter(request);
  assertEquals(response.status, 200);
  const text = await response.text();
  assertEquals(text.startsWith("<img src='data:image/gif;base64,"), true);
  assertEquals(response.headers.get("content-type"), "text/html");
});

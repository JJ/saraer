import { URIgenerator } from "../lib/uri_generator.ts";
import { router, ticket } from "../lib/routes.ts";
import { assert } from "https://deno.land/std@0.203.0/assert/assert.ts";

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

    assert(ticketImg.startsWith("data:image/gif;base64,"));
    const data = ticketImg.slice(22);
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    await Deno.writeFile("tests/test.gif", bytes);

    const qr_decoder = new Deno.Command("zbarimg", {
      args: ["tests/test.gif"],
    });
    const { code, stdout, stderr } = await qr_decoder.output();

    await Deno.remove("tests/test.gif");
    const decoder = new TextDecoder();

    assert(code === 0);
    assert(
      decoder
        .decode(stderr)
        .startsWith("scanned 1 barcode symbols from 1 images in")
    );
    const decodedOutput = decoder.decode(stdout);

    assert(decodedOutput.startsWith("QR-Code:"));

    assert(decodedOutput.includes(ticketData[0]));

    assert(decodedOutput.includes(ticketData[1]));

    const digest = decodedOutput.split("/").pop();
    assert(digest !== undefined);
  }
);

Deno.test("The router should return a 404 for an unknown route", async () => {
  const ourRouter = router(aUriGenerator);
  const request = new Request("https://test.data/unknown-route");
  const response = await ourRouter(request);
  assert(response.status === 404);
});

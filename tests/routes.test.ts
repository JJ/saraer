import { assertInstanceOf } from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { URIgenerator } from "../lib/uri_generator.ts";
import { ticket } from "../lib/routes.ts";
import { assert } from "https://deno.land/std@0.203.0/assert/assert.ts";

const aUriGenerator = new URIgenerator("https://test.data/test/");

Deno.test(async function testTicketRoute() {
  const ticketData = ["session-id", "talk-id"];
  const headers = new Headers();
  headers.set("user-agent", "test-user-agent");
  headers.set("accept", "test-accept");
  headers.set("accept-language", "test-accept-language");

  const response = await ticket(aUriGenerator, ticketData, headers);

  assertInstanceOf(response, Response);
  assert(response.headers.get("content-type") === "image/gif");
  const body = await response.text();
  assert(body.startsWith("data:image/gif;base64,"));
  const data = body.slice(22);
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  await Deno.writeFile("tests/test.gif", bytes);

  // run external command zbarimg on that file
  const qr_decoder = new Deno.Command("zbarimg", { args: ["tests/test.gif"] });
  const { code, stdout, stderr } = await qr_decoder.output();
  assert(code === 0);

  // decode stdout to string
  const decoder = new TextDecoder();
  const decodedOutput = decoder.decode(stdout);
  console.log(decodedOutput);

  // check that the output is correct
  assert(decodedOutput.startsWith("QR-Code:"));

  // check that the output contains the sessionId
  assert(decodedOutput.includes(ticketData[0]));

  // check that the output contains the talkId
  assert(decodedOutput.includes(ticketData[1]));

  // check that the output contains a digest as last fragment
  const digest = decodedOutput.split("/").pop();
  assert(digest !== undefined);
});

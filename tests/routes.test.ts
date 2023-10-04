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
});

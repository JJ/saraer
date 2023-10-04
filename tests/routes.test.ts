import { assertInstanceOf } from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { URIgenerator } from "../lib/uri_generator.ts";
import { ticket } from "../lib/routes.ts";

const aUriGenerator = new URIgenerator("https://test.data/test/");

Deno.test(async function testTicketRoute() {
  const ticketData = ["session-id", "talk-id"];
  const headers = new Headers();
  headers.set("user-agent", "test-user-agent");
  headers.set("accept", "test-accept");
  headers.set("accept-language", "test-accept-language");

  const response = await ticket(aUriGenerator, ticketData, headers);

  assertInstanceOf(response, Response);
});

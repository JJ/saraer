// generate test for URIgenerator
import { assertExists } from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { URIgenerator } from "../lib/uri_generator.ts";

// import user-agents.json
const userAgentData = await Deno.readTextFile("./user-agents.json");

Deno.test(function testURIgenerator() {
  for (const headerData of userAgentData) {
    assertExists(URIgenerator(headerData));
  }
});

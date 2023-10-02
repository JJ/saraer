// generate test for URIgenerator
import { assertExists } from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { URIgenerator } from "../lib/uri_generator.ts";

// import user-agents.json
const userAgentData = JSON.parse(
  await Deno.readTextFile("tests/user-agents.json")
);
const aUriGenerator = new URIgenerator();

Deno.test(function testURIgenerator() {
  for (const headerData of userAgentData) {
    console.log(headerData);
    assertExists(aUriGenerator.generateIdFromBrowser(headerData));
  }
});

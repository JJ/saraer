// generate test for URIgenerator
import { assertNotEquals } from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { HeaderData, URIgenerator } from "../lib/uri_generator.ts";

// import user-agents.json
const userAgentData = JSON.parse(
  await Deno.readTextFile("tests/user-agents.json")
);
const pairsOfData: Array<Array<HeaderData>> = [];
for (const i in userAgentData) {
  const headerData = userAgentData[i];
  for (const j in userAgentData) {
    if (j <= i) {
      continue;
    }
    pairsOfData.push([headerData, userAgentData[j]]);
  }
}

const aUriGenerator = new URIgenerator();

Deno.test(function testUserAgentDataProcessor() {
  for (const headerData of pairsOfData) {
    assertNotEquals(
      aUriGenerator.generateIdFromBrowser(headerData[0]),
      aUriGenerator.generateIdFromBrowser(headerData[1])
    );
  }
});

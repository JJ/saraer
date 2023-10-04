// generate test for URIgenerator
import {
  assertEquals,
  assertInstanceOf,
  assertNotEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";

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

const aUriGenerator = new URIgenerator("https://test.data/test/");

Deno.test(
  "Tests consistency of uri generators",
  function testUserAgentDataProcessor() {
    for (const headerData of userAgentData) {
      const generatedId = aUriGenerator.generateIdFromBrowser(headerData);
      const generatedIdFromCache =
        aUriGenerator.generateIdFromBrowser(headerData);
      assertEquals(generatedId, generatedIdFromCache);
      assertEquals(aUriGenerator.isUserRegistered(generatedId), true);
    }

    for (const headerData of pairsOfData) {
      assertNotEquals(
        aUriGenerator.generateIdFromBrowser(headerData[0]),
        aUriGenerator.generateIdFromBrowser(headerData[1])
      );
    }
  }
);

Deno.test(
  "URIs are generated with the correct class and format",
  function testUriGenerator() {
    for (const header of userAgentData) {
      const sessionId = "session-id";
      const talkId = "talk-id";
      const uri = aUriGenerator.generateUri(sessionId, talkId, header);
      const realUri = new URL(uri);
      assertInstanceOf(realUri, URL);
    }
  }
);

Deno.test(
  "The QR is generated as a Base64 image",
  async function testUriGenerator() {
    for (const header of userAgentData) {
      const sessionId = "session-1";
      const talkId = "talk-33";
      const qr: string = await aUriGenerator.generateQRCode(
        sessionId,
        talkId,
        header
      );
      assertStringIncludes(qr, "data:image/gif;base64,");
    }
  }
);

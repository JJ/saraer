// generate test for URIgenerator
import {
  assertExists,
  assertInstanceOf,
  assertNotEquals,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";

import { HeaderData, URIgenerator } from "../lib/uri_generator.ts";

import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

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

Deno.test(function testUserAgentDataProcessor() {
  for (const headerData of pairsOfData) {
    assertNotEquals(
      aUriGenerator.generateIdFromBrowser(headerData[0]),
      aUriGenerator.generateIdFromBrowser(headerData[1])
    );
  }
});

Deno.test(function testUriGenerator() {
  for (const header of userAgentData) {
    const sessionId = "session-id";
    const talkId = "talk-id";
    const uri = aUriGenerator.generateUri(sessionId, talkId, header);
    const realUri = new URL(uri);
    assertInstanceOf(realUri, URL);
  }
});

Deno.test(async function testUriGenerator() {
  for (const header of userAgentData) {
    const sessionId = "session-1";
    const talkId = "talk-33";
    const qr: QRCode = await aUriGenerator.generateQRCode(
      sessionId,
      talkId,
      header
    );
    console.log(qr);
    assertExists(qr);
  }
});

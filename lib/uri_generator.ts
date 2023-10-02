import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

export interface HeaderData {
  user_agent: string;
  accept: string;
  accept_language: string;
}

export class URIgenerator {
  private encoder: TextEncoder;
  private URLprefix: string;

  constructor(URLprefix: string) {
    this.encoder = new TextEncoder();
    this.URLprefix = URLprefix;
  }

  generateIdFromBrowser({ user_agent, accept, accept_language }: HeaderData) {
    const collated = `${user_agent} | ${accept} | ${accept_language}`;
    const data = this.encoder.encode(collated);
    const hashArray = Array.from(
      new Uint8Array(crypto.subtle.digestSync("SHA-256", data))
    );
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  generateUri(sessionId: string, talkId: string, headerData: HeaderData) {
    return `${
      this.URLprefix
    }/${sessionId}/${talkId}/${this.generateIdFromBrowser(headerData)}`;
  }

  generateQRCode(sessionId: string, talkId: string, headerData: HeaderData) {
    const uri = this.generateUri(sessionId, talkId, headerData);
    return qrcode(uri);
  }
}

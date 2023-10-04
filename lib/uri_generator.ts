import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

export interface HeaderData {
  user_agent: string;
  accept: string;
  accept_language: string;
}

export class URIgenerator {
  private encoder: TextEncoder = new TextEncoder();
  private URLprefix: string;
  private cache: Map<string, string> = new Map();
  private digestSet: Set<string> = new Set();

  constructor(URLprefix: string) {
    this.URLprefix = URLprefix;
  }

  generateIdFromBrowser({
    user_agent,
    accept,
    accept_language,
  }: HeaderData): string {
    const collated = `${user_agent} | ${accept} | ${accept_language}`;
    if (this.cache.has(collated)) {
      return this.cache.get(collated) as string;
    }
    const data = this.encoder.encode(collated);
    const hashArray = Array.from(
      new Uint8Array(crypto.subtle.digestSync("SHA-256", data))
    );
    const digest = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    this.cache.set(collated, digest);
    this.digestSet.add(digest);
    return this.cache.get(collated) as string;
  }

  generateUri(sessionId: string, talkId: string, headerData: HeaderData) {
    return `${
      this.URLprefix
    }/${sessionId}/${talkId}/${this.generateIdFromBrowser(headerData)}`;
  }

  async generateQRCode(
    sessionId: string,
    talkId: string,
    headerData: HeaderData
  ): Promise<string> {
    const uri = this.generateUri(sessionId, talkId, headerData);
    return (await qrcode(uri)).toString();
  }

  isUserRegistered(digest: string): boolean {
    return this.digestSet.has(digest);
  }
}

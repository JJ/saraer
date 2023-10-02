import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";

export interface HeaderData {
  user_agent: string;
  accept: string;
  accept_language: string;
}

export class URIgenerator {
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  generateIdFromBrowser({ user_agent, accept, accept_language }: HeaderData) {
    const collated = `${user_agent} | ${accept} | ${accept_language}`;
    const data = this.encoder.encode(collated);
    const hashArray = Array.from(
      new Uint8Array(crypto.subtle.digestSync("SHA-256", data))
    );
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

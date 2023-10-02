import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";

interface HeaderData {
  user_agent: string;
  accept: string;
  accept_language: string;
}

export class URIgenerator {
  private encoder: TextEncoder;

  constructor() {
    this.encoder = new TextEncoder();
  }

  generateIdFromBrowser({ user_agent, accept, accept_language }: HeaderData) {
    const collated = `${user_agent} | ${accept} | ${accept_language}`;
    const data = this.encoder.encode(collated);
    return crypto.subtle.digestSync("SHA-256", data);
  }
}

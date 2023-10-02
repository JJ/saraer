import { crypto } from "https://deno.land/std@0.203.0/crypto/mod.ts";

class URIgenerator {
  private encoder: TextEncoder;

  constructor() {
    this.encoder = new TextEncoder();
  }

  generateIdFromBrowser({ user_agent, accept, accept_language }) {
    const string = `${user_agent} | ${accept} | ${accept_language}`;
    const data = this.encoder.encode(string);
    return crypto.subtle.digestSync("SHA-256", data);
  }
}

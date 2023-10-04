import { URIgenerator } from "./uri_generator.ts";

export function router(generator: URIgenerator) {
  return async (request: Request) => {
    // Parse the request path
    const path = new URL(request.url).pathname;
    const headers = request.headers;
    const [route, ...ticketData] = path.split("/");
    if (route === "ticket") {
      return await ticket(generator, ticketData, headers);
    }
  };
}

async function ticket(
  generator: URIgenerator,
  ticketData: Array<string>,
  headers: Headers
) {
  const [sessionId, talkId] = ticketData;
  const ticket = await generator.generateQRCode(sessionId, talkId, {
    user_agent: headers.get("user-agent") || "",
    accept: headers.get("accept") || "",
    accept_language: headers.get("accept-language") || "",
  });

  return new Response(ticket, {
    headers: {
      "content-type": "image/gif",
    },
  });
}

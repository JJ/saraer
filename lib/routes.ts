import { URIgenerator } from "./uri_generator.ts";

export function router(generator: URIgenerator) {
  return async (request: Request): Promise<Response> => {
    console.log(request.url);
    const path = new URL(request.url).pathname;
    const headers = request.headers;
    //  split the path into the route (first element) and the rest in ticketData

    const [_, route, ...ticketData] = path.split("/");
    console.log(route);
    if (route === "ticket") {
      return await ticket(generator, ticketData, headers);
    }
    return new Response("Not found", { status: 404 });
  };
}

export async function ticket(
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

  return new Response(`<img src=\'${ticket}\'>`, {
    headers: {
      "content-type": "text/html",
    },
  });
}

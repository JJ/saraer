import { URIgenerator } from "./uri_generator.ts";
import { BeerBucket } from "./beers.ts";

export function router(generator: URIgenerator, bucket: BeerBucket) {
  return async (request: Request): Promise<Response> => {
    console.log(request.url);
    const path = new URL(request.url).pathname;
    const headers = request.headers;

    const [_, route, ...ticketData] = path.split("/");
    if (route === "ticket") {
      const ticketImg = await ticket(generator, ticketData, headers);
      return new Response(`<img src=\'${ticketImg}\'>`, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
    if (route === "beer") {
      const goodTicket = beer(bucket, ticketData);
      if (goodTicket) {
        return new Response(stylize("&#10004"), {
          headers: {
            "content-type": "text/html",
          },
        });
      } else {
        // similarly styled red cross for bad ticket
        return new Response(stylize("&#10008"), {
          headers: {
            "content-type": "text/html",
          },
        });
      }
    }

    return new Response("Not found", { status: 404 });
  };
}

export async function ticket(
  generator: URIgenerator,
  ticketData: Array<string>,
  headers: Headers
): Promise<string> {
  const [sessionId, talkId] = ticketData;
  const ticket = await generator.generateQRCode(sessionId, talkId, {
    user_agent: headers.get("user-agent") || "",
    accept: headers.get("accept") || "",
    accept_language: headers.get("accept-language") || "",
  });

  return ticket;
}

export function beer(bucket: BeerBucket, ticketData: Array<string>): boolean {
  const [sessionId, talkId, userId] = ticketData;
  return bucket.consumeTicket(`${sessionId}/${talkId}/${userId}`);
}

function stylize(text: string) {
  return `<div style="font-size:90vw">${text}</div>`;
}

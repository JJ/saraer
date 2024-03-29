import { URIgenerator } from "./uri_generator.ts";
import { BeerBucket } from "./beers.ts";

//
export const check = "&#9989";
export const cross = "&#10060";
const kv = await Deno.openKv();

const beers: string[][] = [];
export function router(generator: URIgenerator, bucket: BeerBucket) {
  return async (request: Request): Promise<Response> => {
    console.log(request.url);
    await kv.set(["logs", Date.now()], request.url);
    const path = new URL(request.url).pathname;
    const headers = request.headers;

    const [_, route, ...ticketData] = path.split("/");
    if (ticketData[0] === "") {
      ticketData.shift();
    }
    if (route === "ticket") {
      const ticketImg = await ticket(generator, ticketData, headers);
      return new Response(`<img src=\'${ticketImg}\'>`, {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    if (route === "tickets") {
      const log = await kv.list<string>({ prefix: ["tickets"] });
      const loggedTkts = [];
      for await (const res of log) {
        loggedTkts.push(res);
      }
      return new Response(JSON.stringify(loggedTkts), {
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (route === "logs") {
      const log = await kv.list<string>({ prefix: ["logs"] });
      const loggedUris = [];
      for await (const res of log) {
        loggedUris.push(res);
      }
      return new Response(JSON.stringify(loggedUris), {
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (route === "beer") {
      const goodTicket = beer(bucket, ticketData);
      if (goodTicket) {
        beers.push(ticketData);
        await kv.set(["beers", Date.now()], ticketData);
        return respond(check);
      } else {
        return respond(cross);
      }
    }

    if (route === "beers") {
      const log = await kv.list<string>({ prefix: ["beers"] });
      const loggedBeers = [];
      for await (const res of log) {
        loggedBeers.push(res);
      }
      return new Response(JSON.stringify(loggedBeers), {
        headers: {
          "content-type": "application/json",
        },
      });
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
    accept_encoding: headers.get("accept-encoding") || "",
    connection: headers.get("connection") || "",
  });

  return ticket;
}

export function beer(bucket: BeerBucket, ticketData: Array<string>): boolean {
  const [sessionId, talkId, userId] = ticketData;
  return bucket.consumeTicket(`${sessionId}/${talkId}/${userId}`);
}

function stylize(text: string, color = "black") {
  return `<div style="font-size:90vw; color:${color}">${text}</div>`;
}

function respond(text: string, color = "black") {
  return new Response(stylize(text, color), {
    headers: {
      "content-type": "text/html",
    },
  });
}

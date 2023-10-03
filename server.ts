import { HeaderData, URIgenerator } from "./lib/uri_generator.ts";

// Serve two routes, one for "tickets" and one for "beers
// The "tickets" route will return beer ticket
// The "beers" route will store the request and return a green tick mark

const deploymentURL= Deno.env.get("DEPLOYMENT_URL") || "http://localhost:8000";

// Create a URI generator
const generator = new URIgenerator(deploymentURL);

Deno.server(async (_req) => {
    // Parse the request path
    const path = (new URL(_req.url)).pathname
    const headers = _req.r.headers;
    const [ route, sessionId, talkId, userId] = path.split("/");
    // If the route is "tickets", generate a ticket
    if ( route === "ticket") {
        // Generate a ticket
        const ticket = await generator.generateQRCode(sessionId, talkId, {
            user_agent: headers.get("user-agent") || "",
            accept: headers.get("accept") || "",
            accept_language: headers.get("accept-language") || "",
        });
        // Return the ticket as a base64 encoded GIF
        return new Response(ticket, {
            headers: {
                "content-type": "image/gif",
            },
        });
    }
);



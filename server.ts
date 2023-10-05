import { URIgenerator } from "./lib/uri_generator.ts";
import { router } from "./lib/routes.ts";
import { BeerBucket } from "./lib/beers.ts";

// Serve two routes, one for "tickets" and one for "beers
// The "tickets" route will return beer ticket
// The "beers" route will store the request and return a green tick mark

const deploymentURL = Deno.env.get("DEPLOYMENT_URL") || "http://localhost";
const deploymentPort = Deno.env.get("DEPLOYMENT_PORT");
const BEERS = parseInt(Deno.env.get("BEERS") || "10");

// Create a URI generator
const generator = new URIgenerator(deploymentURL);
const beerBucket = new BeerBucket(BEERS);
let config = {};
if (deploymentPort) {
  config = { port: parseInt(deploymentPort) };
}
Deno.serve(config, router(generator, beerBucket));

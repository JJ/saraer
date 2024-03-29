import { URIgenerator } from "./lib/uri_generator.ts";
import { router } from "./lib/routes.ts";
import { BeerBucket } from "./lib/beers.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL") || "http://localhost";
const deploymentPort = Deno.env.get("DEPLOYMENT_PORT");
const BEERS = parseInt(Deno.env.get("BEERS") || "2000");
const beerRoute = Deno.env.get("BEER_ROUTE") || "beer";

const generator = new URIgenerator(`${deploymentURL}/${beerRoute}`);
const beerBucket = new BeerBucket(BEERS);
let config = {};
if (deploymentPort) {
  config = { port: parseInt(deploymentPort) };
}
Deno.serve(config, router(generator, beerBucket));

import { BeerBucket } from "../lib/beers.ts";
import { assertEquals } from "https://deno.land/std@0.174.0/testing/asserts.ts";

const maxBeers = 4;

const beerBucket = new BeerBucket(maxBeers);

// generate three tickets
const tickets = [
  "session-1/talk-1/user-id-1",
  "session-1/talk-2/user-id-2",
  "session-1/talk-2/user-id-3",
];

Deno.test(" BeerBucket should consume tickets only once", () => {
  for (const ticket of tickets) {
    assertEquals(beerBucket.consumeTicket(ticket), true);
    assertEquals(beerBucket.consumeTicket(ticket), false);
  }
});

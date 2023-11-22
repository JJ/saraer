import { BeerBucket } from "../lib/beers.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";

const maxBeers = 5;

const beerBucket = new BeerBucket(maxBeers);

// generate three tickets
const tickets = [
  "session-1/talk-1/user-id-1",
  "session-1/talk-2/user-id-2",
  "session-1/talk-2/user-id-3",
  "/session-1/talk-3/user-id-4",
];

Deno.test(" BeerBucket should consume tickets only once", () => {
  for (const ticket of tickets) {
    assertEquals(beerBucket.consumeTicket(ticket), true);
    assertEquals(beerBucket.consumeTicket(ticket), false);
  }
});

Deno.test("BeerBucket should check if all beers have been consumed", () => {
  beerBucket.consumeTicket("session-1/talk-3/user-id-3");
  assertThrows(() => beerBucket.consumeTicket("session-1/talk-2/user-id-4"));
});

export class BeerBucket {
  private totalBeersConsumed = 0;
  private maxBeers = 0;
  private ticketsConsumed: Set<string> = new Set();
  private beersByTalk: Map<string, number> = new Map();
  private beersBySession: Map<string, number> = new Map();
  private beersByUser: Map<string, number> = new Map();

  constructor(maxBeersPerSession: number) {
    this.maxBeers = maxBeersPerSession;
  }

  public consumeTicket(ticket: string): boolean {
    if (this.totalBeersConsumed >= this.maxBeers) {
      throw new Error(
        `No more beers available, all ${this.maxBeers} have been consumed`
      );
    }
    if (this.ticketsConsumed.has(ticket)) {
      return false;
    }
    this.ticketsConsumed.add(ticket);
    this.totalBeersConsumed += 1;
    const [sessionId, talkId, userId] = ticket.split("/");
    const talkKey = `${sessionId}/${talkId}`;
    this.beersBySession.set(
      sessionId,
      (this.beersBySession.get(sessionId) || 0) + 1
    );
    this.beersByTalk.set(talkKey, (this.beersByTalk.get(talkKey) || 0) + 1);
    this.beersByUser.set(userId, (this.beersByUser.get(userId) || 0) + 1);

    return true;
  }
}

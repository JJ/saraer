export class BeerBucket {
  private totalBeersConsumed: number = 0;
  private maxBeersPerSession: number = 0;
  private ticketsConsumed: Set<string> = new Set();
  private beersByTalk: Map<string, number> = new Map();
  private beersBySession: Map<string, number> = new Map();

  constructor(maxBeersPerSession: number) {
    this.maxBeersPerSession = maxBeersPerSession;
  }
}

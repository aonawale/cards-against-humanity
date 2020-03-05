export default class Deck {
  constructor(cards) {
    this.cards = cards;
  }

  deal(count = 10) {
    return this.cards.splice(-1 * count, count);
  }

  shuffle() {
    // FIX this
    this.cards.sort();
  }
}

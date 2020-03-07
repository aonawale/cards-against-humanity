export default class Deck {
  constructor(cards = []) {
    this.cards = cards;
  }

  pop() {
    return this.cards.pop();
  }

  deal(count = 5) {
    return this.cards.splice(-1 * count, count);
  }

  shuffle() {
    // FIX this
    this.cards.sort();
  }
}

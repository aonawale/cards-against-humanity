export default class Deck {
  constructor(cards = []) {
    this.cards = cards;
  }

  draw() {
    return this.cards.pop();
  }

  deal(count = 5) {
    return this.cards.splice(-1 * count, count).reverse();
  }

  shuffle() {
    // FIX this
    this.cards.sort();
  }
}

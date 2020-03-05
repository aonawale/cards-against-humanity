export default class Card {
  constructor(text, pick, isFaceUp = false) {
    this.text = text;
    this.pick = pick;
    this.isFaceUp = isFaceUp;
  }
}

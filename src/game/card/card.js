export default class Card {
  constructor(text, pick = null, isFaceUp = false) {
    this.text = text;
    this.pick = pick;
    this.isFaceUp = isFaceUp;
  }
}

export const converter = {
  toFirestore(card) {
    return {
      text: card.text,
      pick: card.pick,
      isFaceUp: card.isFaceUp,
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Card(
      data.text,
      data.pick,
      data.isFaceUp,
    );
  },
};

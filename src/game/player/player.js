import { converter as cardConverter } from 'game/card/card';

export default class Player {
  constructor(id, name, createdAt, photoURL, points = 0, cards = []) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.photoURL = photoURL;
    this.points = points;
    this.cards = cards;
  }

  get firstName() {
    return this.name.split(' ')[0];
  }

  incrementPoints() {
    this.points += 1;
  }
}

export const converter = {
  toFirestore(player) {
    return {
      id: player.id,
      name: player.name,
      createdAt: player.createdAt,
      photoURL: player.photoURL,
      points: player.points,
      cards: player.cards.map(cardConverter.toFirestore),
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Player(
      data.id,
      data.name,
      data.createdAt,
      data.photoURL,
      data.points,
      data.cards.map((card) => cardConverter.fromFirestore({ data: () => card }, options)),
    );
  },
};

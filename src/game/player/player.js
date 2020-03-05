export default class Player {
  constructor(id, points, cards = []) {
    this.id = id;
    this.points = points;
    this.cards = cards;
  }
}

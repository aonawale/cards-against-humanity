import Deck from 'game/deck/deck';

export default class Game {
  constructor(id, ownerID, cZar, players, whiteCards, blackCards) {
    this.id = id;
    this.ownerID = ownerID;
    this.cZar = cZar;
    this.players = new Set(...players);
    this.whiteCards = new Deck(whiteCards);
    this.blackCards = new Deck(blackCards);

    this.isStarted = false;
    this.playedBlackCard = null;
    this.playedWhiteCards = new Map();
  }

  addPlayer(player) {
    // max allowed players is 10
    if (this.players.size < 10)
      this.players.add(player);
  }

  start() {
    this.whiteCards.shuffle();
    this.blackCards.shuffle();

    // assign last 5 white cards for each player
    this.players.forEach((player) => {
      player.cards = this.whiteCards.deal(5);
    });

    this.isStarted = true;
  }

  startRound() {
    if (!this.isStarted)
      throw new Error('Game has not started!');

    // replace the last cards played
    this.players.forEach((player) => {
      player.cards.push(this.whiteCards.deal(this.playedBlackCard.pick));
    });

    this.cZar = this.players[3];
    this.playBlackCard();
  }

  // a cZar playing a black card
  playBlackCard() {
    this.playedBlackCard = this.blackCards.pop();
  }

  // a player playing a white card
  playWhiteCard(player, card) {
    const hasPlayed = this.playedWhiteCards.has(player.id);
    const playedCards = this.playedWhiteCards.get(player.id);

    if (hasPlayed && this.playedBlackCard.pick > playedCards.length)
      this.playedWhiteCards.set(player.id, [...playedCards, card]);
    else
      this.playedWhiteCards.set(player.id, [card]);
  }

  // a cZar picking winning cards
  pickWinner(playerID) {
    const cards = this.playedWhiteCards.get(playerID);
    cards.forEach((card) => (card.isFaceUp = true));

    this.players.find(({ id }) => id === playerID);
  }
}

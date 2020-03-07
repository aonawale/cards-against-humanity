import Deck from 'game/deck/deck';
import { converter as cardConverter } from 'game/card/card';
import { converter as playerConverter } from 'game/player/player';

export default class Game {
  constructor(id, name, ownerID, cZarID, players, whiteCards, blackCards,
    playedBlackCard, playedWhiteCards) {
    this.id = id;
    this.name = name;
    this.ownerID = ownerID;
    this.cZarID = cZarID;
    this.players = players;
    this.whiteCardsDeck = new Deck(whiteCards);
    this.blackCardsDeck = new Deck(blackCards);
    this.playedBlackCard = playedBlackCard;
    this.playedWhiteCards = new Map(Object.entries(playedWhiteCards || {}));
  }

  addPlayer(player) {
    // max allowed players is 10
    if (this.players.size < 10)
      this.players.add(player);
  }

  // start() {
  //   if (this.isStarted)
  //     throw new Error('Game has already started!');
  //   // shuffle cards
  //   this.whiteCardsDeck.shuffle();
  //   this.blackCardsDeck.shuffle();

  //   // assign last 5 white cards to each player
  //   this.players.forEach((player) => {
  //     player.cards = this.whiteCardsDeck.deal(5);
  //   });

  //   this.isStarted = true;
  // }

  startNextRound() {
    // if (!this.isStarted)
    //   throw new Error('Game has not started!');

    // shuffle cards
    // this.whiteCardsDeck.shuffle();
    // this.blackCardsDeck.shuffle();

    // // if we have already started playing
    // if (this.playedBlackCard) {
    // replace the last cards played
    this.players.forEach((player) => {
      player.cards = [...player.cards, ...this.whiteCardsDeck.deal(this.playedBlackCard?.pick)];
    });
    this.resetRound();
    this.chooseNextCZar();
    // } else {
    //   // assign last 5 white cards to each player
    //   this.players.forEach((player) => {
    //     player.cards = this.whiteCardsDeck.deal(5);
    //   });
    // }

    this.playBlackCard();
  }

  resetRound() {
    this.playedBlackCard = null;
    this.playedWhiteCards = new Map();
  }

  chooseNextCZar() {
    const index = this.players.findIndex((player) => player.id === this.cZarID);
    const nextIndex = (index + 1) % this.players.length;
    this.cZarID = this.players[nextIndex].id;
  }

  // a cZarID playing a black card
  playBlackCard() {
    this.playedBlackCard = this.blackCardsDeck.pop();
  }

  // a player playing a white card
  playWhiteCard(player, card) {
    if (!this.playedBlackCard)
      throw new Error('Black card has not been played!');

    const hasPlayed = this.playedWhiteCards.has(player.id);
    const playedCards = this.playedWhiteCards.get(player.id);

    if (hasPlayed && this.playedBlackCard.pick <= playedCards.length)
      throw new Error('You cannot play more than the required cards!');
    else if (hasPlayed && this.playedBlackCard.pick > playedCards.length)
      this.playedWhiteCards.set(player.id, [...playedCards, card]);
    else
      this.playedWhiteCards.set(player.id, [card]);
  }

  // picking winner
  pickWinner(playerID) {
    if (this.playedWhiteCards.size !== this.players.length)
      throw new Error('All players must play card(s) before picking a winner!');

    const cards = this.playedWhiteCards.get(playerID);
    cards.forEach((card) => { card.isFaceUp = true; });

    const player = this.players.find(({ id }) => id === playerID);
    player.incrementPoints();
  }
}

export const converter = {
  toFirestore(game) {
    return {
      id: game.id,
      name: game.name,
      ownerID: game.ownerID,
      cZarID: game.cZarID,
      players: game.players.map(playerConverter.toFirestore),
      whiteCards: game.whiteCardsDeck.cards.map(cardConverter.toFirestore),
      blackCards: game.blackCardsDeck.cards.map(cardConverter.toFirestore),
      playedBlackCard: cardConverter.toFirestore(game.playedBlackCard),
      playedWhiteCards: [...game.playedWhiteCards.entries()].reduce(
        (aggr, [key, value]) => ({ ...aggr, [key]: value }), {},
      ),
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new Game(
      data.id,
      data.name,
      data.ownerID,
      data.cZarID,
      data.players.map((player) => playerConverter.fromFirestore({ data: () => player }, options)),
      data.whiteCards.map((card) => cardConverter.fromFirestore({ data: () => card }, options)),
      data.blackCards.map((card) => cardConverter.fromFirestore({ data: () => card }, options)),
      cardConverter.fromFirestore({ data: () => data.playedBlackCard }, options),
      data.playedWhiteCards,
    );
  },
};

import Deck from 'game/deck/deck';
import { converter as cardConverter } from 'game/card/card';
import { converter as playerConverter } from 'game/player/player';

export default class Game {
  constructor(id, name, ownerID, cZarID, players, lastWhiteCard,
    playedBlackCard, playedWhiteCards) {
    this.id = id;
    this.name = name;
    this.ownerID = ownerID;
    this.cZarID = cZarID;
    this.players = players;
    this.playedBlackCard = playedBlackCard;
    this.playedWhiteCards = new Map(Object.entries(playedWhiteCards || {}));
    this.lastWhiteCard = lastWhiteCard;
  }

  static findCardIndex(cards, cardToFind) {
    let foundIndex = -1;
    if (cardToFind?.text)
      foundIndex = cards.findIndex((card) => card.text === cardToFind?.text);
    if (foundIndex < 0)
      foundIndex = cards.length;
    return foundIndex;
  }

  setWhiteCards(cards) {
    const foundIndex = Game.findCardIndex(cards, this.lastWhiteCard);
    const whiteCards = [];
    for (let index = 0; index < foundIndex; index++)
      whiteCards.push(cards[index]);
    this.whiteCardsDeck = new Deck(whiteCards);
  }

  setBlackCards(cards) {
    const foundIndex = Game.findCardIndex(cards, this.playedBlackCard);
    const blackCards = [];
    for (let index = 0; index < foundIndex; index++)
      blackCards.push(cards[index]);
    this.blackCardsDeck = new Deck(blackCards);
  }

  setLastWhiteCard() {
    // set last white card
    const lastPlayer = this.players[this.players.length - 1];
    [this.lastWhiteCard] = lastPlayer.cards;
  }

  addPlayer(player) {
    if (this.players.length >= 10)
      throw new Error('Max allowed players is 10!');
    player.cards = [...player.cards, ...this.whiteCardsDeck.deal(5)];
    this.players.push(player);
    this.setLastWhiteCard();
  }

  hasPlayer(playerID) {
    return !!this.players.find(({ id }) => id === playerID);
  }

  startNextRound() {
    const dealCount = this.playedBlackCard?.pick || 5;

    this.players.forEach((player) => {
      // don't deal cards to cZar if game has already started
      if (!this.playedBlackCard || (player.id !== this.cZarID))
        player.cards = [...player.cards, ...this.whiteCardsDeck.deal(dealCount)];
    });

    this.setLastWhiteCard();
    this.resetRound();
    this.chooseNextCZar();
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
    this.blackCardsCount -= 1;
  }

  canPlayWhiteCard(player) {
    const hasPlayed = this.playedWhiteCards.has(player.id);
    const playedCards = this.playedWhiteCards.get(player.id);

    return this.cZarID !== player.id
      && this.playedBlackCard
      && (!hasPlayed || this.playedBlackCard.pick > playedCards.length);
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

    // // set last played white card
    // this.lastWhiteCard = card;

    // remove the card from the player cards
    player.cards = player.cards.filter(({ text }) => text !== card.text);
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
      players: game.players.reduce(
        (aggr, player) => ({ ...aggr, [player.id]: playerConverter.toFirestore(player) }), {},
      ),
      lastWhiteCard: game.lastWhiteCard ? cardConverter.toFirestore(game.lastWhiteCard) : null,
      playedBlackCard: cardConverter.toFirestore(game.playedBlackCard),
      playedWhiteCards: [...game.playedWhiteCards.entries()].reduce(
        (aggr, [key, value]) => ({ ...aggr, [key]: value.map(cardConverter.toFirestore) }), {},
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
      Object.entries(data.players).map(([, player]) => playerConverter.fromFirestore({ data: () => player }, options)),
      data.lastWhiteCard,
      cardConverter.fromFirestore({ data: () => data.playedBlackCard }, options),
      data.playedWhiteCards,
    );
  },
};

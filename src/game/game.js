import Deck from 'game/deck/deck';
import { converter as cardConverter } from 'game/card/card';
import { converter as playerConverter } from 'game/player/player';

const gameStates = {
  playingCards: Symbol('playingCards'), // players are playing cards
  pickingWinner: Symbol('pickingWinner'), // czar picking winner
  winnerSelected: Symbol('winnerSelected'), // winner is selected
};

class Game {
  constructor(id, name, ownerID, cZarID, players, state, lastWhiteCard,
    playedBlackCard, playedWhiteCards, roundWinnerID) {
    this.id = id;
    this.name = name;
    this.ownerID = ownerID;
    this.cZarID = cZarID;
    this.players = players;
    this.playedBlackCard = playedBlackCard;
    this.playedWhiteCards = new Map(Object.entries(playedWhiteCards || {}));
    this.lastWhiteCard = lastWhiteCard;
    this.state = state;
    this.roundWinnerID = roundWinnerID;
  }

  static findCardIndex(cards, cardToFind) {
    if (!cardToFind)
      return cards.length; // return early if there is no cardToFind

    let index = cards.length;
    while (index--) {
      if (cards[index].text === cardToFind?.text)
        break;
    }
    return index;
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

  setState(state) {
    if (!Object.values(gameStates).includes(state))
      throw new Error('Invalid state');
    this.state = state;
  }

  setLastWhiteCard() {
    // set last white card
    const lastPlayer = this.players[this.players.length - 1];
    this.lastWhiteCard = lastPlayer.cards[lastPlayer.cards.length - 1];
  }

  addPlayer(player) {
    if (this.players.length >= 10)
      throw new Error('Max allowed players is 10!');
    player.cards = this.whiteCardsDeck.deal(5);
    this.players.push(player);
    // set last white card to last dealt card
    this.lastWhiteCard = player.cards[player.cards.length - 1];
  }

  hasPlayer(playerID) {
    return !!this.players.find(({ id }) => id === playerID);
  }

  startNextRound() {
    this.dealWhiteCardsToPlayers();
    this.resetCurrentRound();
    this.chooseNextCZar();
    this.playBlackCard();
    this.setState(gameStates.playingCards);
  }

  dealWhiteCardsToPlayers() {
    const dealCount = this.playedBlackCard?.pick || 5;

    this.players.forEach((player) => {
      // don't deal cards to cZar if game has already started
      if (!this.playedBlackCard || (player.id !== this.cZarID)) {
        const cards = this.whiteCardsDeck.deal(dealCount);
        player.cards = [...player.cards, ...cards];
        // set last white card to last dealt card
        this.lastWhiteCard = cards[cards.length - 1];
      }
    });
  }

  resetCurrentRound() {
    this.roundWinnerID = null;
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
    this.playedBlackCard = this.blackCardsDeck.draw();
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

    // remove the card from the player cards
    player.cards = player.cards.filter(({ text }) => text !== card.text);
  }

  // This can be further improved by saving playerID on the card
  // assigned to a player and generating a UID for each card
  // just in case we have two cards with same text value
  cardPlayer(card) {
    const [playerID] = [...this.playedWhiteCards.entries()].find(
      ([, cards]) => cards.find(({ text }) => text === card.text),
    );

    return this.players.find(({ id }) => id === playerID);
  }

  get canPickWinner() {
    const cards = [...this.playedWhiteCards.values()].reduce(
      (aggr, curr) => [...aggr, ...curr], [],
    );
    return this.players.length > 1
    && this.playedBlackCard
    && cards.length === ((this.players.length - 1) * this.playedBlackCard.pick);
  }

  // picking winner
  pickWinner(card) {
    if (!this.canPickWinner)
      throw new Error('All players must play card(s) before picking a winner!');

    const [playerID] = [...this.playedWhiteCards.entries()].find(
      ([, cards]) => cards.find(({ text }) => text === card.text),
    );

    const player = this.cardPlayer(card);

    player.incrementPoints();
    this.roundWinnerID = playerID;
  }
}

const converter = {
  convertStateToFirestore(state) {
    return Object.entries(gameStates).find(([, value]) => value === state)[0];
  },

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
      state: this.convertStateToFirestore(game.state),
      roundWinnerID: game.roundWinnerID || null,
    };
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return new Game(
      data.id,
      data.name,
      data.ownerID,
      data.cZarID,
      Object.entries(data.players).map(
        ([, player]) => playerConverter.fromFirestore({ data: () => player }, options),
      ).sort((a, b) => a.createdAt - b.createdAt),
      Object.entries(gameStates).find(([key]) => key === data.state)[1],
      data.lastWhiteCard,
      cardConverter.fromFirestore({ data: () => data.playedBlackCard }, options),
      data.playedWhiteCards,
      data.roundWinnerID,
    );
  },
};

export default Game;

export {
  gameStates,
  converter,
};

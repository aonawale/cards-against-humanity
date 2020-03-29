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
    this.playedWhiteCards = playedWhiteCards || new Map();
    this.lastWhiteCard = lastWhiteCard;
    this.state = state;
    this.roundWinnerID = roundWinnerID;
  }

  // //---------------------- Static functions
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

  // //---------------------------- Getters
  get canPickWinner() {
    const cards = [...this.playedWhiteCards.values()].reduce(
      (aggr, curr) => [...aggr, ...curr], [],
    );
    return this.players.length > 1
    && this.playedBlackCard
    && cards.length === ((this.players.length - 1) * this.playedBlackCard.pick);
  }

  get pendingPlayers() {
    return this.players.filter(({ id }) => this.playedBlackCard
      && this.cZarID !== id
      && (!this.playedWhiteCards.has(id)
      || (this.playedWhiteCards.get(id).length < this.playedBlackCard?.pick)));
  }

  get roundWinner() {
    return this.players.find((({ id }) => id === this.roundWinnerID));
  }

  get roundWinnerCards() {
    return this.playedWhiteCards.get(this.roundWinnerID);
  }

  // //---------------------------- Instance methods
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
      if (!this.playedBlackCard || (player.id !== this.cZarID))
        this.dealCardsToPlayer(player, dealCount);
    });
  }

  dealCardsToPlayer(player, dealCount) {
    const cards = this.whiteCardsDeck.deal(dealCount);
    cards.forEach((card) => {
      card.playerID = player.id;
      player.cards.push(card);
    });
    // set last white card to last dealt card
    this.lastWhiteCard = cards[cards.length - 1];
  }

  cardPlayer(card) {
    return this.players.find(({ id }) => id === card.playerID);
  }

  hasPlayer(playerID) {
    return !!this.players.find(({ id }) => id === playerID);
  }

  addPlayer(player) {
    if (this.players.length >= 10)
      throw new Error('Max allowed players is 10!');
    this.dealCardsToPlayer(player, 5);
    this.players.push(player);
  }

  removePlayer(player) {
    if (player.id === this.ownerID)
      throw new Error('The owner cannot leave his own game');
    if (!this.hasPlayer(player.id))
      throw new Error('The player is not in this game');
    // remove player played white cards
    this.playedWhiteCards.delete(player.id);
    // remove player
    this.players = this.players.filter(({ id }) => id !== player.id);
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
      cardConverter.fromFirestore({ data: () => data.lastWhiteCard }, options),
      cardConverter.fromFirestore({ data: () => data.playedBlackCard }, options),
      [...Object.entries(data.playedWhiteCards)].reduce(
        (aggr, [key, value]) => aggr.set(
          key,
          value.map((card) => cardConverter.fromFirestore({ data: () => card }, options)),
        ),
        new Map(),
      ),
      data.roundWinnerID,
    );
  },
};

export default Game;

export {
  gameStates,
  converter,
};

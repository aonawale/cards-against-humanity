/* eslint-disable max-classes-per-file */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card, { cardTypes } from 'components/Card/Card';
import { fetchCards, blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';

class Card {
  constructor(text, text) {
    this.text = text;
    this.pick = pick;
  }
}

class Player {
  constructor(id) {
    this.id = id;
    this.points = 0;
    this.playerCards = [];
  }
}

class Deck {
  cards = []

  constructor(cards) {
    this.cards = cards;
  }

  deal(count = 10) {
    return this.cards.splice(-1 * count, count);
  }

  shuffle() {
    // FIX this
    this.cards.sort();
  }
}

class Game {
  isStarted = false

  playedBlackCard = null

  playedWhiteCards = new Map()

  winningCards = new Set()

  constructor(id, cZar, players, whiteCards, blackCards) {
    this.id = id;
    this.cZar = cZar;
    this.players = new Set(...players);
    this.whiteCards = new Deck(whiteCards);
    this.blackCards = new Deck(blackCards);
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
    if (!this.isStarted) {
      throw new Error('Game has not started!');
    }
    // replace the last cards played
    this.players.forEach((player) => {
      player.cards.push(this.whiteCards.deal(this.playedBlackCard.pick));
    });

    this.cZar = this.players[3]
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
  pickWinningWhiteCard(card) {
    if (this.playedBlackCard.pick < this.winningCards.length)
      this.winningCards.push(card);
  }
}

const GamePage = () => {
  const [whiteCards, setWhiteCards] = useState([]);
  const [blackCards, setBlackCards] = useState([]);

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const subscription = whiteCardsListSubject.subscribe(setWhiteCards);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = blackCardsListSubject.subscribe(setBlackCards);
    return () => subscription.unsubscribe();
  }, []);

  const index = Math.round(Math.random() * blackCards.length);

  return (
    <Box p={2}>
      <Grid container spacing={4} justify="center">
        {blackCards[index] && (
          <Grid item key={blackCards[index].text}>
            <Card text={blackCards[index].text} type={cardTypes.black} />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={4} justify="center">
        {whiteCards.slice(0, 5).map((card) => (
          <Grid item key={card.text}>
            <Card text={card.text} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GamePage;

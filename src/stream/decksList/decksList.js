import {
  from, ReplaySubject,
} from 'rxjs';
import {
  map, filter, flatMap, tap, share,
} from 'rxjs/operators';
import Card, { cardTypes } from 'game/card/card';

const setsURL = 'https://cards-against-humanity-api.herokuapp.com/sets';
const cardsURL = (set) => `https://cards-against-humanity-api.herokuapp.com/sets/${set}`;

const defaultDeckSubject = new ReplaySubject();
const decksListSubject = new ReplaySubject();

from(fetch(setsURL)).pipe(
  filter((response) => response),
  flatMap((response) => response.json()),
  map((response) => response
    .map((({ setName }) => ({ id: setName, name: setName.charAt(0).toUpperCase() + setName.slice(1) })))
    .sort((a, b) => {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    })),
  tap((response) => console.log('decksListSubject =>', response)),
).subscribe(decksListSubject);

decksListSubject.pipe(
  map((decks) => decks.find(({ id }) => id.toLowerCase() === 'base')),
  filter((val) => !!val),
  tap((response) => console.log('defaultDeckSubject =>', response)),
).subscribe(defaultDeckSubject);

const fetchCards = (deckID) => from(fetch(cardsURL(deckID))).pipe(
  filter((response) => response),
  flatMap((response) => response.json()),
  tap((response) => console.log('cardsResponseObservable =>', response)),
  map(({ whiteCards, blackCards }) => ({
    whiteCards: whiteCards.map((text) => new Card(cardTypes.white, text)),
    blackCards: blackCards.map(({ text, pick }) => new Card(cardTypes.black, text, pick)),
  })),
  share(),
);

export {
  decksListSubject,
  defaultDeckSubject,
  fetchCards,
};

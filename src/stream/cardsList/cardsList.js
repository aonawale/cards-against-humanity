import { from, Subject } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';

const url = 'https://cards-against-humanity-api.herokuapp.com/sets/Base';

const blackCardsListSubject = new Subject();
const whiteCardsListSubject = new Subject();
const cardsResponseSubject = new Subject();

from(fetch(url)).pipe(
  filter((response) => response),
  flatMap((response) => response.json()),
).subscribe(cardsResponseSubject);

cardsResponseSubject.pipe(
  map(({ blackCards }) => blackCards),
  map((cards) => cards.map(({ text, pick }) => ({
    text,
    pick,
  }))),
).subscribe(blackCardsListSubject);

cardsResponseSubject.pipe(
  map(({ whiteCards }) => whiteCards),
  map((cards) => cards.map((card) => ({
    text: card,
  }))),
).subscribe(whiteCardsListSubject);

export {
  blackCardsListSubject,
  whiteCardsListSubject,
};

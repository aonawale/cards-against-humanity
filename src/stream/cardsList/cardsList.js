import { from, Subject, BehaviorSubject } from 'rxjs';
import {
  map, filter, flatMap, take, tap, share,
} from 'rxjs/operators';

const url = 'https://cards-against-humanity-api.herokuapp.com/sets/Base';

const blackCardsListSubject = new Subject();
const whiteCardsListSubject = new Subject();
const cardsLoadedSubject = new BehaviorSubject(false);

const cardsResponseObservable = from(fetch(url)).pipe(
  filter((response) => response),
  flatMap((response) => response.json()),
  share(),
  tap((response) => console.log('cardsResponseObservable response', response)),
);

cardsResponseObservable.pipe(
  take(1),
  map(() => true),
).subscribe(cardsLoadedSubject);

cardsResponseObservable.pipe(
  map(({ blackCards }) => blackCards),
  map((cards) => cards.map(({ text, pick }) => ({ text, pick }))),
).subscribe(blackCardsListSubject);

cardsResponseObservable.pipe(
  map(({ whiteCards }) => whiteCards),
  map((cards) => cards.map((card) => ({ text: card }))),
).subscribe(whiteCardsListSubject);

export {
  blackCardsListSubject,
  whiteCardsListSubject,
};

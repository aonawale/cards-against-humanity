import { from, Subject, BehaviorSubject } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';

const url = 'https://cards-against-humanity-api.herokuapp.com/sets/Base';

const cardsResponseSubject = new Subject();
const cardsLoadedSubject = new BehaviorSubject(false);
const blackCardsListSubject = new BehaviorSubject([]);
const whiteCardsListSubject = new BehaviorSubject([]);

const fetchCards = () => {
  cardsLoadedSubject.pipe(
    filter((loaded) => !loaded),
    flatMap(() => from(fetch(url))),
    filter((response) => response),
    flatMap((response) => response.json()),
  ).subscribe((res) => {
    cardsLoadedSubject.next(true);
    cardsResponseSubject.next(res);
  });
};

cardsResponseSubject.pipe(
  map(({ blackCards }) => blackCards),
  map((cards) => cards.map(({ text, pick }) => ({ text, pick }))),
).subscribe(blackCardsListSubject);

cardsResponseSubject.pipe(
  map(({ whiteCards }) => whiteCards),
  map((cards) => cards.map((card) => ({ text: card }))),
).subscribe(whiteCardsListSubject);

export {
  fetchCards,
  blackCardsListSubject,
  whiteCardsListSubject,
};

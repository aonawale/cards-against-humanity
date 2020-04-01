import { ReplaySubject, combineLatest, of } from 'rxjs';
import {
  map, tap, distinctUntilChanged, switchMap,
} from 'rxjs/operators';
import { firestore as db } from 'lib/firebase';
import Card, { cardTypes } from 'game/card/card';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';
import { blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';

const currentGameSubject = new ReplaySubject(1);

combineLatest([
  selectedGameIDSubject,
  whiteCardsListSubject,
  blackCardsListSubject,
]).pipe(
  distinctUntilChanged(([prevID], [nextID]) => prevID === nextID),
  switchMap(([id, whiteCards, blackCards]) => (id ? doc(db.collection('games').doc(id).withConverter(converter)).pipe(
    map((snapshot) => snapshot.data()),
    map((game) => [game, whiteCards, blackCards]),
  ) : of([]))),
  map(([game, whiteCards, blackCards]) => {
    if (!game)
      return undefined;
    game.setWhiteCards(whiteCards.map(({ text }) => new Card(cardTypes.white, text)));
    game.setBlackCards(blackCards.map(({ text, pick }) => new Card(cardTypes.black, text, pick)));
    return game;
  }),
  tap((val) => console.log('currentGame =>', val)),
).subscribe(currentGameSubject);

export default currentGameSubject;

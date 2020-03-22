import { ReplaySubject } from 'rxjs';
import {
  map, tap, filter, distinctUntilChanged, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { firestore as db } from 'lib/firebase';
import Card from 'game/card/card';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';
import { blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';

const currentGameSubject = new ReplaySubject(1);

selectedGameIDSubject.pipe(
  filter((id) => !!id),
  distinctUntilChanged(),
  switchMap((id) => doc(db.collection('games').doc(id).withConverter(converter))),
  map((snapshot) => snapshot.data()),
  withLatestFrom(whiteCardsListSubject, blackCardsListSubject),
  map(([game, whiteCards, blackCards]) => {
    if (!game)
      return undefined;
    game.setWhiteCards(whiteCards.map(({ text }) => new Card(text)));
    game.setBlackCards(blackCards.map(({ text, pick }) => new Card(text, pick)));
    return game;
  }),
  tap((val) => console.log('currentGame =>', val)),
).subscribe(currentGameSubject);

export default currentGameSubject;

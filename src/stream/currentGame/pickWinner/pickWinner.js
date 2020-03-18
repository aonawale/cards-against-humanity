import { Subject } from 'rxjs';
import {
  tap, distinctUntilKeyChanged, withLatestFrom, filter,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import { firestore as db } from 'lib/firebase';

const pickWinnerSubject = new Subject();

const pickWinner = (card) => pickWinnerSubject.next(card);

pickWinnerSubject.pipe(
  filter((card) => !!card),
  distinctUntilKeyChanged('text'),
  withLatestFrom(
    currentGameSubject.pipe(filter((game) => !!game)),
  ),
  tap((val) => console.log('pickWinnerSubject emits =>', val)),
  filter(([, game]) => game.canPickWinner),
  tap(([card, game]) => game.pickWinner(card)),
  tap((val) => console.log('pickWinnerSubject picked winner =>', val)),
).subscribe(([, game]) => {
  db.collection('games').doc(game.id).update({
    roundWinnerID: game.roundWinnerID,
  });
});

export default pickWinner;

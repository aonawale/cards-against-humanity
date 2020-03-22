import { Subject } from 'rxjs';
import {
  tap, withLatestFrom, filter, map,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';

const nextRoundSubject = new Subject();

const nextRound = () => nextRoundSubject.next();

nextRoundSubject.pipe(
  withLatestFrom(
    currentGameSubject.pipe(filter((game) => !!game)),
    currentPlayerSubject,
  ),
  filter(([, game, player]) => game.cZarID === player.id),
  map(([, game]) => game),
  tap((game) => game.startNextRound()),
  tap((val) => console.log('nextRoundSubject starts next round =>', val)),
).subscribe((game) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

export default nextRound;

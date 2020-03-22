import { Subject } from 'rxjs';
import {
  tap, distinctUntilKeyChanged, withLatestFrom, filter,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';

const playCardSubject = new Subject();

const playCard = (card) => playCardSubject.next(card);

playCardSubject.pipe(
  filter((card) => !!card),
  distinctUntilKeyChanged('text'),
  withLatestFrom(
    currentGameSubject.pipe(filter((game) => !!game)),
    currentPlayerSubject,
  ),
  tap((val) => console.log('playCardSubject emits =>', val)),
  filter(([, game, player]) => game.canPlayWhiteCard(player)),
  tap(([card, game, player]) => game.playWhiteCard(player, card)),
  tap((val) => console.log('playCardSubject play card =>', val)),
).subscribe(([, game]) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

export default playCard;

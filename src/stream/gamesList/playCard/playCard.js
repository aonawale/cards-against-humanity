import { from, Subject } from 'rxjs';
import {
  switchMap, tap, map, distinctUntilChanged, withLatestFrom, filter, take,
} from 'rxjs/operators';
import currentPlayerSubject from 'stream/gamesList/currentPlayer/currentPlayer';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';
import { firestore } from 'lib/firebase';
import { converter } from 'game/game';

const playCardSubject = new Subject();
const playerPlayedCardSubject = new Subject();

const playCard = (card) => playCardSubject.next(card);

playCardSubject.pipe(
  filter((card) => !!card),
  distinctUntilChanged(),
  withLatestFrom(selectedGameSubject, currentPlayerSubject),
  tap((val) => console.log('playCardSubject emits =>', val)),
  filter(([, game, player]) => game.canPlayWhiteCard(player)),
  tap(([card, game, player]) => game.playWhiteCard(player, card)),
  tap((val) => console.log('playCardSubject play card =>', val)),
  switchMap(([card, game, player]) => from(
    firestore.collection('games').doc(game.id).withConverter(converter).set(game),
  ).pipe(
    map(() => ({ card, player })),
  )),
).subscribe(playerPlayedCardSubject);

export default playCard;

export {
  playerPlayedCardSubject,
};

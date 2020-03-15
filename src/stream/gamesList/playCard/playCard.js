import { from, Subject } from 'rxjs';
import {
  switchMap, tap, map, distinctUntilKeyChanged, withLatestFrom, filter, pairwise, concatMap, flatMap,
} from 'rxjs/operators';
import currentPlayerSubject from 'stream/gamesList/currentPlayer/currentPlayer';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';

const playCardSubject = new Subject();
const playerPlayedCardSubject = new Subject();

const playCard = (card) => playCardSubject.next(card);

playCardSubject.pipe(
  filter((card) => !!card),
  distinctUntilKeyChanged('text'),
  withLatestFrom(
    selectedGameSubject.pipe(filter((game) => !!game)),
    currentPlayerSubject,
  ),
  tap((val) => console.log('playCardSubject emits =>', val)),
  filter(([, game, player]) => game.canPlayWhiteCard(player)),
  tap(([card, game, player]) => game.playWhiteCard(player, card)),
  tap((val) => console.log('playCardSubject play card =>', val)),
  switchMap(([card, game, player]) => from(
    db.collection('games').doc(game.id).withConverter(converter).set(game),
  ).pipe(
    map(() => ({ card, player })),
  )),
).subscribe(() => {});

selectedGameSubject.pipe(
  filter((game) => !!game),
  map((game) => game.players),
  tap((val) => console.log('pl4444444 =>', val)),
  flatMap((v) => from(v)),
  tap((val) => console.log('playerPlayedCardSubject players play card =>', val)),
  // map((player) => player.cards),
  // tap((val) => console.log('playerPlayedCardSubject players play card =>', val)),
  // pairwise(),
  // tap((val) => console.log('playerPlayedCardSubject players play card =>', val)),
  // map(([prev, curr]) => curr.filter((currItem) => !prev.find((prevItem) => currItem.text === prevItem.text))),
  // tap((val) => console.log('playerPlayedCardSubject players play card =>', val)),
).subscribe(playerPlayedCardSubject);

export default playCard;

export {
  playerPlayedCardSubject,
};

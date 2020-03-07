import { from, Subject } from 'rxjs';
import {
  switchMap, tap, map, distinctUntilChanged, withLatestFrom, filter, take,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { selectGame } from 'stream/gamesList/gamesList';
import { firestore } from 'lib/firebase';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import Player from 'game/player/player';

const joinGameSubject = new Subject();
const playerJoinedGameSubject = new Subject();

const joinGame = (id) => joinGameSubject.next(id);

joinGameSubject.pipe(
  filter((id) => !!id),
  distinctUntilChanged(),
  tap((val) => console.log('joinGameSubject emits =>', val)),
  map((gameID) => firestore.collection('games').doc(gameID).withConverter(converter)),
  switchMap((ref) => doc(ref).pipe(take(1))),
  map((snapshot) => snapshot.data()),
  tap((val) => console.log('joinGameSubject snapshot data=>', val)),
  withLatestFrom(currentUserSubject.pipe(
    map(({ id, displayName }) => new Player(id, displayName)),
  )),
  filter(([game, player]) => !game.hasPlayer(player)),
  tap(([game, player]) => game.addPlayer(player)),
  tap((val) => console.log('joinGameSubject game add player =>', val)),
  switchMap(([game]) => from(firestore.collection('games').doc(game.id).withConverter(converter).set(game)).pipe(
    map(() => game),
  )),
).subscribe((game) => {
  selectGame(game.id);
  playerJoinedGameSubject.next(game);
});

export default joinGame;

export {
  playerJoinedGameSubject,
};

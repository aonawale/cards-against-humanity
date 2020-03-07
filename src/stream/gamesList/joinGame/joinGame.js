import { from, Subject } from 'rxjs';
import {
  flatMap, tap, map, distinctUntilChanged, withLatestFrom, filter,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { selectGame } from 'stream/gamesList/gamesList';
import { firestore } from 'lib/firebase';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import Player from 'game/player/player';

const joinGameSubject = new Subject();

const joinGame = (id) => joinGameSubject.next(id);

joinGameSubject.pipe(
  distinctUntilChanged(),
  map((gameID) => firestore.collection('games').doc(gameID).withConverter(converter)),
  flatMap((ref) => doc(ref)),
  tap(console.log),
  withLatestFrom(currentUserSubject.pipe(
    map(({ id, displayName }) => new Player(id, displayName)),
  )),
  filter(([game, player]) => !game.hasPlayer(player)),
  tap(console.log),
  tap(([game, player]) => game.addPlayer(player)),
  tap(console.log),
  flatMap(([game]) => from(firestore.collection('games').doc(game.id).withConverter(converter).set(game))),
).subscribe(({ id }) => selectGame(id));

export default joinGame;

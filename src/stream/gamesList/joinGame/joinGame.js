import { from, Subject } from 'rxjs';
import {
  tap, map, withLatestFrom, filter, concatMap, pairwise,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import currentGameSubject from 'stream/currentGame/currentGame';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';
import Player from 'game/player/player';

const joinGameSubject = new Subject();
const playerJoinedGameSubject = new Subject();

const joinGame = (id) => joinGameSubject.next(id);

joinGameSubject.pipe(
  withLatestFrom(
    currentGameSubject.pipe(
      filter((game) => !!game),
    ),
    currentUserSubject.pipe(filter((user) => !!user)),
  ),
  map(([id, game, { id: uid, displayName, photoURL }]) => [
    id,
    game,
    new Player(uid, displayName, Date.now(), photoURL),
  ]),
  tap((val) => console.log('will ADD game add player =>', val)),
  filter(([id, game, player]) => id === game.id && !game.hasPlayer(player)),
  tap(([, game, player]) => game.addPlayer(player)),
  map(([, game]) => game),
  tap((val) => console.log('joinGameSubject game add player =>', val)),
).subscribe((game) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

currentGameSubject.pipe(
  filter((game) => game),
  map((game) => game.players),
  pairwise(),
  map(([prev, curr]) => curr.filter((currItem) => !prev.find((prevItem) => currItem.id === prevItem.id))),
  filter((val) => val.length),
  tap((val) => console.log('playerJoinedGameSubject players join game =>', val)),
  concatMap((players) => from(players)),
).subscribe(playerJoinedGameSubject);

export default joinGame;

export {
  playerJoinedGameSubject,
};

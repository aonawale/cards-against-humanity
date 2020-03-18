import { from, Subject } from 'rxjs';
import {
  tap, map, distinctUntilChanged, withLatestFrom, filter, concatMap, pairwise,
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
  distinctUntilChanged(),
  withLatestFrom(
    currentGameSubject.pipe(
      filter((game) => !!game),
    ),
    currentUserSubject.pipe(
      map(({ id, displayName }) => new Player(id, displayName)),
    ),
  ),
  filter(([id, game, player]) => id === game.id && !game.hasPlayer(player)),
  tap(([, game, player]) => game.addPlayer(player)),

  tap((val) => console.log('joinGameSubject game add player =>', val)),
  map(([, game]) => [game, converter.toFirestore(game).players]),
  tap((val) => console.log('joinGameSubject converted players =>', val)),
).subscribe(([game, players]) => {
  from(db.collection('games').doc(game.id).update({ players }));
});

currentGameSubject.pipe(
  filter((game) => game),
  map((game) => game.players),
  pairwise(),
  map(([prev, curr]) => curr.filter((currItem) => !prev.find((prevItem) => currItem.id === prevItem.id))),
  filter((val) => val.length),
  tap((val) => console.log('playerJoinedGameSubject players join game =>', val)),
  concatMap(from),
).subscribe(playerJoinedGameSubject);

export default joinGame;

export {
  playerJoinedGameSubject,
};

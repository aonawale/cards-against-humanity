import { Subject, from } from 'rxjs';
import {
  tap, withLatestFrom, filter, map, pairwise, concatMap,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';

const leaveGameSubject = new Subject();
const playerLeaveGameSubject = new Subject();

const leaveGame = () => leaveGameSubject.next();

leaveGameSubject.pipe(
  withLatestFrom(
    currentGameSubject.pipe(filter((game) => !!game)),
    currentPlayerSubject,
  ),
  filter(([, game, player]) => game.ownerID !== player.id),
  map(([, game, player]) => [game, player]),
  tap(([game, player]) => game.removePlayer(player)),
  tap((val) => console.log('leaveGameSubject remove player =>', val)),
).subscribe(([game]) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

// player leaves a game
currentGameSubject.pipe(
  filter((game) => !!game),
  map((game) => game.players),
  pairwise(),
  map(([prev, curr]) => prev.filter((prevItem) => !curr.find((currItem) => prevItem.id === currItem.id))),
  filter((players) => players.length),
  tap((val) => console.log('playerLeaveGameSubject players left game =>', val)),
  concatMap((players) => from(players)),
).subscribe(playerLeaveGameSubject);

export default leaveGame;

export {
  playerLeaveGameSubject,
};

import { Subject, from } from 'rxjs';
import {
  flatMap, tap, withLatestFrom, filter,
} from 'rxjs/operators';
import { firestore } from 'lib/firebase';
import gamesListSubject from 'stream/gamesList/gamesList';
import { currentUserSubject } from 'stream/currentUser/currentUser';

const deleteGameSubject = new Subject();

const deleteGame = (id) => deleteGameSubject.next(id);

deleteGameSubject.pipe(
  withLatestFrom(currentUserSubject, gamesListSubject),
  tap((val) => console.log('deleteGameSubject before filter =>', val)),
  filter(([id, currentUser, gamesList]) => gamesList.find((game) => game.id === id)?.ownerID === currentUser.id),
  tap((val) => console.log('deleteGameSubject after filter =>', val)),
  flatMap(([id]) => from(firestore.collection('games').doc(id).delete())),
).subscribe(() => {});

export default deleteGame;

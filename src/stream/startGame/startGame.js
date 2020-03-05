import { Subject, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/firebaseCurrentUser';
import { firestore } from 'lib/firebase';
import { collectionData } from 'rxfire/auth';

const newGameSubject = new Subject();

const startGame = (id) => {
  newGameSubject.next({ id });
};

combineLatest([
  newGameSubject,
  currentUserSubject,
]).pipe(
  map(([{ id }, { id: uid }]) => ({
    id,
    game: {
      uid,
    },
  })),
  switchMap(({ id, game }) => from(firestore.collection('games').doc(id).set(game))),
);

export default startGame;

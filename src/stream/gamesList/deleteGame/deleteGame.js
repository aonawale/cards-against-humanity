import { Subject, from } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { firestore } from 'lib/firebase';

const deleteGameSubject = new Subject();

const deleteGame = (id) => deleteGameSubject.next(id);

deleteGameSubject.pipe(
  tap(console.log),
  flatMap((id) => from(firestore.collection('games').doc(id).delete())),
).subscribe(() => {});

export default deleteGame;

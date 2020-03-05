import { Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/firebaseCurrentUser';
import { firestore } from 'lib/firebase';
import { collectionData } from 'rxfire/auth';

const gamesListSubject = new Subject();

currentUserSubject.pipe(
  map(({ id }) => firestore.collection('games').where('ownerID', '==', id)),
  switchMap((ref) => collectionData(ref, 'id')),
).subscribe(gamesListSubject);

export default gamesListSubject;

import { Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { firestore } from 'lib/firebase';
import { collection } from 'rxfire/firestore';
import { converter } from 'game/game';

const gamesListSubject = new Subject();

// combineLatest([
//   currentUserSubject,

// ])

currentUserSubject.pipe(
  map(({ id }) => firestore.collection('games').where('ownerID', '==', id).withConverter(converter)),
  switchMap((ref) => collection(ref)),
  map((snapshots) => snapshots.map((snap) => snap.data())),
  tap(console.log),
).subscribe(gamesListSubject);

export default gamesListSubject;

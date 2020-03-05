import { Subject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { authStateSubject } from 'stream/eventSources/firebaseEventSources';
import { firebaseApp } from 'lib/firebase';

const currentUserSubject = new Subject();
const currentUserIsAuthenticatedSubject = new Subject();

authStateSubject.pipe(
  map(({ user }) => !!user),
).subscribe(currentUserIsAuthenticatedSubject);

authStateSubject.pipe(
  map(({ user }) => user),
  filter((user) => !!user),
  map(({ uid, email, displayName }) => ({
    id: uid,
    email,
    displayName,
  })),
).subscribe(currentUserSubject);

currentUserSubject.subscribe((user) => {
  firebaseApp.firestore().collection('users').doc(user.id).set(user);
});

export {
  currentUserSubject,
  currentUserIsAuthenticatedSubject,
};

import { Subject, ReplaySubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { auth, firestore } from 'lib/firebase';
import { authState } from 'rxfire/auth';

const authStateSubject = new Subject();
const currentUserSubject = new ReplaySubject(1);
const currentUserIsAuthenticatedSubject = new ReplaySubject(1);

authState(auth).subscribe(authStateSubject);

authStateSubject.pipe(
  map((user) => !!user),
).subscribe(currentUserIsAuthenticatedSubject);

authStateSubject.pipe(
  filter((user) => !!user),
  map(({
    uid, email, displayName, photoURL,
  }) => ({
    id: uid,
    email,
    displayName,
    photoURL,
  })),
).subscribe(currentUserSubject);

currentUserSubject.subscribe((user) => {
  firestore.collection('users').doc(user.id).set(user);
});

export {
  currentUserSubject,
  currentUserIsAuthenticatedSubject,
};

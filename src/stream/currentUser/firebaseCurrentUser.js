import { Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { auth, firestore } from 'lib/firebase';
import { authState } from 'rxfire/auth';

const authStateSubject = new Subject();
const currentUserSubject = new Subject();
const currentUserIsAuthenticatedSubject = new Subject();

authState(auth).subscribe(authStateSubject);

authStateSubject.pipe(
  map((user) => !!user),
).subscribe(currentUserIsAuthenticatedSubject);

authStateSubject.pipe(
  filter((user) => !!user),
  map(({ uid, email, displayName }) => ({
    id: uid,
    email,
    displayName,
  })),
).subscribe(currentUserSubject);

currentUserSubject.subscribe((user) => {
  firestore.collection('users').doc(user.id).set(user);
});

export {
  currentUserSubject,
  currentUserIsAuthenticatedSubject,
};

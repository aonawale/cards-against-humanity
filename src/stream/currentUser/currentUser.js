import { Subject, ReplaySubject } from 'rxjs';
import {
  map, filter, take, delay,
} from 'rxjs/operators';
import { auth, firestore } from 'lib/firebase';
import { authState } from 'rxfire/auth';

const authStateSubject = new Subject();
const currentUserSubject = new ReplaySubject(1);
const authStateDeterminedSubject = new Subject();
const isAuthenticatedSubject = new ReplaySubject(1);

authState(auth).subscribe(authStateSubject);

authStateSubject.pipe(
  map((user) => !!user),
).subscribe(isAuthenticatedSubject);

isAuthenticatedSubject.pipe(
  take(1),
  map(() => true),
  delay(500),
).subscribe(authStateDeterminedSubject);

authStateSubject.pipe(
  map((user) => (user
    ? ({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
    : undefined)),
).subscribe(currentUserSubject);

currentUserSubject.pipe(
  filter((user) => !!user),
).subscribe((user) => {
  firestore.collection('users').doc(user.id).set(user);
});

export {
  currentUserSubject,
  isAuthenticatedSubject,
  authStateDeterminedSubject,
};

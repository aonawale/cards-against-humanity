import { Observable, Subject } from 'rxjs';
import { firebaseApp } from 'lib/firebase';

const authStateSubject = new Subject();

Observable.create((observer) => {
  firebaseApp.auth().onAuthStateChanged((user) => {
    observer.next({ user, eventName: 'auth.authStateChanged' });
  });
}).subscribe(authStateSubject);

export {
  // eslint-disable-next-line import/prefer-default-export
  authStateSubject,
};

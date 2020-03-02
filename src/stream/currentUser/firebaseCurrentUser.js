import { Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { authStateSubject } from 'stream/eventSources/firebaseEventSources';

const currentUserSubject = new Subject();

authStateSubject.pipe(
  map(({ user }) => user),
  filter((user) => !!user),
).subscribe(currentUserSubject);

export default currentUserSubject;

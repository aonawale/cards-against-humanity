import { ReplaySubject, combineLatest } from 'rxjs';
import { map, tap, distinctUntilKeyChanged } from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import currentGameSubject from 'stream/currentGame/currentGame';

const currentPlayerSubject = new ReplaySubject(1);

combineLatest([
  currentUserSubject,
  currentGameSubject.pipe(distinctUntilKeyChanged('id')),
]).pipe(
  map(([currentUser, game]) => game?.players?.find(({ id }) => id === currentUser.id)),
  tap((val) => console.log('currentPlayerSubject =>', val)),
).subscribe(currentPlayerSubject);

export default currentPlayerSubject;

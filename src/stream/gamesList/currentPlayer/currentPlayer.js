import { ReplaySubject, combineLatest } from 'rxjs';
import {
  map, tap, filter, distinctUntilKeyChanged,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';

const currentPlayerSubject = new ReplaySubject(1);

combineLatest([
  currentUserSubject,
  selectedGameSubject.pipe(distinctUntilKeyChanged('id')),
]).pipe(
  map(([currentUser, { players }]) => players.find(({ id }) => id === currentUser.id)),
  filter((player) => !!player),
  tap(console.log),
).subscribe(currentPlayerSubject);

export default currentPlayerSubject;

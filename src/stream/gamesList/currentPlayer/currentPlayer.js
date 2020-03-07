import { ReplaySubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';

const currentPlayerSubject = new ReplaySubject(1);

combineLatest([
  currentUserSubject,
  selectedGameSubject,
]).pipe(
  map(([currentUser, game]) => game?.players.find(({ id }) => id === currentUser.id)),
  tap((val) => console.log('currentPlayerSubject =>', val)),
).subscribe(currentPlayerSubject);

export default currentPlayerSubject;

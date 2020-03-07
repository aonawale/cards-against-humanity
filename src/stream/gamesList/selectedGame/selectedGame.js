import { ReplaySubject, combineLatest } from 'rxjs';
import {
  map, tap, filter, distinctUntilChanged,
} from 'rxjs/operators';
import gamesListSubject, { selectedGameIDSubject } from 'stream/gamesList/gamesList';

const selectedGameSubject = new ReplaySubject(1);

combineLatest([
  gamesListSubject,
  selectedGameIDSubject.pipe(distinctUntilChanged()),
]).pipe(
  map(([gamesList, selectedGameID]) => gamesList.find(({ id }) => id === selectedGameID)),
  filter((game) => !!game),
  tap(console.log),
).subscribe(selectedGameSubject);

export default selectedGameSubject;

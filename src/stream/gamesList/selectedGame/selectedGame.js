import { Subject, combineLatest } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import gamesListSubject, { selectedGameIDSubject } from 'stream/gamesList/gamesList';

const selectedGameSubject = new Subject();

combineLatest([
  gamesListSubject,
  selectedGameIDSubject,
]).pipe(
  map(([gamesList, selectedGameID]) => gamesList.find(({ id }) => id === selectedGameID)),
  filter((game) => !!game),
  tap(console.log),
).subscribe(selectedGameSubject);

export default selectedGameSubject;

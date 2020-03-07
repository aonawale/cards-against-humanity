import { ReplaySubject } from 'rxjs';
import {
  map, tap, filter, distinctUntilChanged, flatMap,
} from 'rxjs/operators';
import { firestore } from 'lib/firebase';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';

const selectedGameSubject = new ReplaySubject(1);

selectedGameIDSubject.pipe(
  distinctUntilChanged(),
  map((id) => firestore.collection('games').doc(id).withConverter(converter)),
  flatMap((ref) => doc(ref)),
  tap(console.log),
  filter((game) => !!game),
  tap(console.log),
).subscribe(selectedGameSubject);

export default selectedGameSubject;

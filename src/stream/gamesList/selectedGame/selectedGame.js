import { ReplaySubject } from 'rxjs';
import {
  map, tap, filter, distinctUntilChanged, switchMap,
} from 'rxjs/operators';
import { firestore } from 'lib/firebase';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';

const selectedGameSubject = new ReplaySubject(1);

selectedGameIDSubject.pipe(
  filter((id) => !!id),
  distinctUntilChanged(),
  map((id) => firestore.collection('games').doc(id).withConverter(converter)),
  switchMap((ref) => doc(ref)),
  map((snapshot) => snapshot.data()),
  tap((val) => console.log('selectedGameSubject =>', val)),
).subscribe(selectedGameSubject);

export default selectedGameSubject;

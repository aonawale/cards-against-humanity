import {
  ReplaySubject, BehaviorSubject, Subject, from,
} from 'rxjs';
import {
  map, switchMap, tap, take, distinctUntilKeyChanged, filter, flatMap, distinctUntilChanged,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { firestore as db } from 'lib/firebase';
import { collection } from 'rxfire/firestore';
import { converter } from 'game/game';

const gamesListSubject = new ReplaySubject(1);
const gamesListLoadedSubject = new BehaviorSubject(false);
const selectedGameIDSubject = new ReplaySubject(1);
const selectedGameExistSubject = new Subject();

const selectGame = (id) => selectedGameIDSubject.next(id);

selectedGameIDSubject.pipe(
  filter((id) => id),
  distinctUntilChanged(),
  flatMap((id) => from(db.collection('games').doc(id).get())),
  map((snapshot) => snapshot.exists),
).subscribe(selectedGameExistSubject);

currentUserSubject.pipe(
  filter((user) => !!user),
  map(({ id }) => db.collection('games').where(`players.${id}.id`, '==', id).withConverter(converter)),
  switchMap((ref) => collection(ref)),
  map((snapshots) => snapshots.map((snapshot) => snapshot.data())),
  distinctUntilKeyChanged('length'),
  tap((val) => console.log('gamesListSubject =>', val)),
).subscribe(gamesListSubject);

gamesListSubject.pipe(
  take(1),
  map(() => true),
).subscribe(gamesListLoadedSubject);

export default gamesListSubject;

export {
  selectGame,
  selectedGameIDSubject,
  selectedGameExistSubject,
  gamesListLoadedSubject,
};

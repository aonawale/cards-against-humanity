import { ReplaySubject, BehaviorSubject } from 'rxjs';
import {
  map, switchMap, tap, take,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { firestore } from 'lib/firebase';
import { collection } from 'rxfire/firestore';
import { converter } from 'game/game';

const gamesListSubject = new ReplaySubject(1);
const gamesListLoadedSubject = new BehaviorSubject(false);
const selectedGameIDSubject = new ReplaySubject(1);

const selectGame = (id) => selectedGameIDSubject.next(id);

currentUserSubject.pipe(
  map(({ id }) => firestore.collection('games').where(`players.${id}.id`, '==', id).withConverter(converter)),
  switchMap((ref) => collection(ref)),
  map((snapshots) => snapshots.map((snap) => snap.data())),
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
  gamesListLoadedSubject,
};

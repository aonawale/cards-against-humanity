import {
  Subject, of, from, combineLatest,
} from 'rxjs';
import {
  map, tap, distinctUntilChanged, switchMap, filter,
} from 'rxjs/operators';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';
import { converter as deckConverter } from 'game/deck/deck';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';
import { isAuthenticatedSubject } from 'stream/currentUser/currentUser';

const currentGameSubject = new Subject();

combineLatest([
  selectedGameIDSubject.pipe(distinctUntilChanged()),
  isAuthenticatedSubject,
]).pipe(
  filter(([selectedGameID, isAuthenticated]) => isAuthenticated && selectedGameID),
  map(([selectedGameID]) => selectedGameID),
  switchMap((id) => (id
    ? from(db.collection('decks').doc(id).get())
      .pipe(
        filter((snapshot) => snapshot.exists),
        map((snapshot) => snapshot.data()),
        map(({ white, black }) => [
          id,
          deckConverter.fromFirestore({ data: () => white }),
          deckConverter.fromFirestore({ data: () => black }),
        ]),
      )
    : of([]))),
  switchMap(([id, whiteDeck, blackDeck]) => (id
    ? doc(db.collection('games').doc(id).withConverter(converter)).pipe(
      map((snapshot) => snapshot.data()),
      map((game) => [game, whiteDeck, blackDeck]),
    ) : of([]))),
  map(([game, whiteDeck, blackDeck]) => {
    if (!game)
      return undefined;
    game.setWhiteDeck(whiteDeck);
    game.setBlackDeck(blackDeck);
    return game;
  }),
  tap((val) => console.log('currentGame =>', val)),
).subscribe(currentGameSubject);

export default currentGameSubject;

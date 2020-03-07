import { Subject, from } from 'rxjs';
import {
  map, switchMap, withLatestFrom, flatMap, tap,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/firebaseCurrentUser';
import { firestore } from 'lib/firebase';
import Game, { converter } from 'game/game';
import Card from 'game/card/card';
import Player from 'game/player/player';

const url = 'https://cards-against-humanity-api.herokuapp.com/sets/Base';

const newGameSubject = new Subject();

const startGame = () => {
  const { id } = firestore.collection('games').doc();
  newGameSubject.next({ id });
  return id;
};

newGameSubject.pipe(
  withLatestFrom(currentUserSubject),
  switchMap(([game, user]) => from(fetch(url)).pipe(
    flatMap((response) => response.json()),
    map(({ whiteCards, blackCards }) => ({
      game, user, whiteCards, blackCards,
    })),
  )),
  tap(console.log),
  map(({
    game, user, whiteCards, blackCards,
  }) => new Game(
    game.id,
    user.id,
    user.id,
    [new Player(user.id, user.displayName)],
    whiteCards.map((text) => new Card(text)),
    blackCards.map((card) => new Card(card.text, card.pick)),
    true,
    null,
  )),
  tap(console.log),
  switchMap((game) => from(firestore.collection('games').doc(game.id).withConverter(converter).set(game))),
  tap(console.log),
).subscribe(() => {});

export default startGame;

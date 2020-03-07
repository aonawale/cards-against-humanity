import { Subject, from } from 'rxjs';
import {
  map, withLatestFrom, flatMap, tap,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { firestore } from 'lib/firebase';
import Game, { converter } from 'game/game';
import Card from 'game/card/card';
import Player from 'game/player/player';

const url = 'https://cards-against-humanity-api.herokuapp.com/sets/Base';

const newGameSubject = new Subject();

const startGame = (name) => {
  const { id } = firestore.collection('games').doc();
  newGameSubject.next({ id, name });
  return id;
};

newGameSubject.pipe(
  withLatestFrom(currentUserSubject),
  flatMap(([game, user]) => from(fetch(url).then((res) => res.json())).pipe(
    map(({ whiteCards, blackCards }) => ({
      game, user, whiteCards, blackCards,
    })),
  )),
  tap(console.log),
  map(({
    game, user, whiteCards, blackCards,
  }) => new Game(
    game.id,
    game.name,
    user.id,
    user.id,
    [new Player(user.id, user.displayName)],
    whiteCards.map((text) => new Card(text)),
    blackCards.map((card) => new Card(card.text, card.pick)),
    null,
  )),
  tap(console.log),
  tap((game) => game.startNextRound()),
  flatMap((game) => from(firestore.collection('games').doc(game.id).withConverter(converter).set(game))),
).subscribe(() => {});

export default startGame;

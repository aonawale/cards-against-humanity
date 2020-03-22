import { Subject } from 'rxjs';
import {
  map, withLatestFrom, tap,
} from 'rxjs/operators';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';
import { firestore as db } from 'lib/firebase';
import Game, { gameStates, converter } from 'game/game';
import Card from 'game/card/card';
import Player from 'game/player/player';

const newGameSubject = new Subject();

const startGame = (name) => {
  const { id } = db.collection('games').doc();
  newGameSubject.next({ id, name });
  return id;
};

newGameSubject.pipe(
  withLatestFrom(currentUserSubject, whiteCardsListSubject, blackCardsListSubject),
  map(([{ id, name }, user, whiteCards, blackCards]) => {
    const game = new Game(
      id,
      name,
      user.id,
      user.id,
      [new Player(user.id, user.displayName, Date.now())],
      gameStates.playingCards,
    );
    game.setWhiteCards(whiteCards.map(({ text }) => new Card(text)));
    game.setBlackCards(blackCards.map(({ text, pick }) => new Card(text, pick)));
    game.startNextRound();
    return game;
  }),
  tap((val) => console.log('newGameSubject init game =>', val)),
).subscribe((game) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

export default startGame;

import { ReplaySubject, combineLatest, from } from 'rxjs';
import {
  map, tap, filter, distinctUntilChanged, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { firestore as db } from 'lib/firebase';
import Card from 'game/card/card';
import { converter } from 'game/game';
import { doc } from 'rxfire/firestore';
import { selectedGameIDSubject } from 'stream/gamesList/gamesList';
import { blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';
// import { playedWhiteCardsSubject } from 'stream/currentGame/playedCards/playedCards';

const currentGameSubject = new ReplaySubject(1);
const currentGameStateSubject = new ReplaySubject(1);

selectedGameIDSubject.pipe(
  filter((id) => !!id),
  distinctUntilChanged(),
  switchMap((id) => doc(db.collection('games').doc(id).withConverter(converter))),
  map((snapshot) => snapshot.data()),
  withLatestFrom(whiteCardsListSubject, blackCardsListSubject),
  map(([game, whiteCards, blackCards]) => {
    if (!game)
      return null;
    game.setWhiteCards(whiteCards.map(({ text }) => new Card(text)));
    game.setBlackCards(blackCards.map(({ text, pick }) => new Card(text, pick)));
    return game;
  }),
  tap((val) => console.log('currentGameSubject =>', val)),
).subscribe(currentGameSubject);


// combineLatest([
//   currentGameSubject.pipe((game) => !!game),
//   playedWhiteCardsSubject,
// ]).pipe(
//   tap((val) => console.log('currentGameStateSubject =>', val)),
//   filter(([{ state, playedBlackCard }]) => playedBlackCard && state === 'playing_cards'),
//   filter(([{ players, playedBlackCard }, playedWhiteCards]) => playedWhiteCards.length
//     === players.length * playedBlackCard.pick),
//   tap(([game]) => game.setState('picking_winner')),
//   tap((val) => console.log('currentGameStateSubject =>', val)),
//   switchMap(([game]) => from(db.collection('games').doc(game.id).withConverter(converter).set(game))),
// ).subscribe(currentGameStateSubject);

export default currentGameSubject;

export {
  currentGameStateSubject,
};

import {
  Subject, ReplaySubject, from,
} from 'rxjs';
import {
  map, tap, filter, withLatestFrom, pairwise, concatMap, distinctUntilKeyChanged,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { firestore as db } from 'lib/firebase';
import { gameStates, converter } from 'game/game';

const playedWhiteCardsSubject = new ReplaySubject(1);
const playerPlayedCardSubject = new Subject();

// played white cards
currentGameSubject.pipe(
  filter((game) => !!game),
  map((game) => [...game.playedWhiteCards.values()].reduce(
    (aggr, curr) => [...aggr, ...curr], [],
  )),
  distinctUntilKeyChanged('length'),
  tap((val) => console.log('playedWhiteCardsSubject =>', val)),
).subscribe(playedWhiteCardsSubject);

// a player plays a white card
currentGameSubject.pipe(
  withLatestFrom(playedWhiteCardsSubject),
  filter(([game]) => game
    && game.playedBlackCard
    && game.state === gameStates.playingCards
    && game.players.length > 1),
  map(([game, playedWhiteCards]) => [
    game,
    playedWhiteCards.map(({ text, playerID }) => ({ text, playerID })),
  ]),
  pairwise(),
  map(([[, prev], [game, curr]]) => [
    game,
    curr.filter((currItem) => !prev.find((prevItem) => currItem.text === prevItem.text)),
  ]),
  map(([game, cards]) => cards.map((card) => game.cardPlayer(card))),
  filter((players) => players.length),
  tap((val) => console.log('players play white card =>', val)),
  concatMap((players) => from(players)),
).subscribe(playerPlayedCardSubject);

// switch to the picking_winner state when all players
// have played required amount of white cards
currentGameSubject.pipe(
  withLatestFrom(playedWhiteCardsSubject, currentPlayerSubject),
  filter(([game, playedWhiteCards, currentPlayer]) => game
    && game.cZarID === currentPlayer?.id
    && game.playedBlackCard
    && game.state === gameStates.playingCards
    && playedWhiteCards.length
    && game.players.length > 1
    && playedWhiteCards.length === ((game.players.length - 1) * game.playedBlackCard.pick)),
  tap(([game]) => game.setState(gameStates.pickingWinner)),
  tap(([game]) => console.log('update state to =>', game.state)),
).subscribe(([game]) => {
  db.collection('games').doc(game.id).withConverter(converter).set(game);
});

export {
  playedWhiteCardsSubject,
  playerPlayedCardSubject,
};

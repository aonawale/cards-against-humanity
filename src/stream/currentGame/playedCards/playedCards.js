import {
  Subject, ReplaySubject, from,
} from 'rxjs';
import {
  map, tap, filter, switchMap, withLatestFrom, pairwise, concatMap,
} from 'rxjs/operators';
import currentGameSubject from 'stream/currentGame/currentGame';
import { firestore as db } from 'lib/firebase';
import { gameStates } from 'game/game';

const playedWhiteCardsSubject = new ReplaySubject(1);
const playerWinsRoundSubject = new ReplaySubject(1);
const playerPlayedCardSubject = new Subject();

// played white cards
currentGameSubject.pipe(
  filter((game) => !!game),
  map((game) => [...game.playedWhiteCards.values()].reduce(
    (aggr, curr) => [...aggr, ...curr], [],
  )),
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
    playedWhiteCards.map(({ text }) => text),
  ]),
  pairwise(),
  map(([[, prev], [game, curr]]) => [game, curr.filter((currItem) => !prev.includes(currItem))]),
  map(([game, cards]) => cards.map((text) => game.cardPlayer({ text }))),
  filter((players) => players.length),
  tap((val) => console.log('players play white card =>', val)),
  concatMap(from),
).subscribe(playerPlayedCardSubject);

// switch to the picking_winner state when all players
// have played required amount of white cards
currentGameSubject.pipe(
  withLatestFrom(playedWhiteCardsSubject),
  filter(([game, playedWhiteCards]) => game
    && game.playedBlackCard
    && game.state === gameStates.playingCards
    && playedWhiteCards.length
    && game.players.length > 1
    && playedWhiteCards.length === ((game.players.length - 1) * game.playedBlackCard.pick)),
  tap(([game]) => game.setState(gameStates.pickingWinner)),
  tap(([game]) => console.log('update state to =>', game.state)),
).subscribe(([game]) => {
  from(db.collection('games').doc(game.id).update({ state: game.state }));
});

// switch to the winner_selected state when the cZar has
// selected winner for the current round and emit the player
currentGameSubject.pipe(
  filter((game) => game
    && game.playedBlackCard
    && game.state === gameStates.pickingWinner
    && game.players.length > 1),
  map((game) => [game, game.roundWinnerID]),
  pairwise(),
  filter(([[, prev], [, curr]]) => !prev && curr),
  map(([, [game]]) => game),
  tap((game) => game.setState('winner_selected')),
  switchMap((game) => from(db.collection('games')
    .doc(game.id).update({ state: game.state })
    .then(() => game.players.find(({ id }) => id === game.roundWinnerID)))),
  tap((player) => console.log('playerWinsRound and update state to winner_selected ==>', player)),
).subscribe(playerWinsRoundSubject);

export {
  playedWhiteCardsSubject,
  playerWinsRoundSubject,
  playerPlayedCardSubject,
};

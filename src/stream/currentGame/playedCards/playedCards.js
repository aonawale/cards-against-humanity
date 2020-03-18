import {
  Subject, ReplaySubject, combineLatest, from,
} from 'rxjs';
import {
  map, tap, filter, switchMap, withLatestFrom, pairwise,
} from 'rxjs/operators';
import currentPlayerSubject from 'stream/currentPlayer/currentPlayer';
import currentGameSubject from 'stream/currentGame/currentGame';
import { firestore as db } from 'lib/firebase';

const playedWhiteCardsSubject = new ReplaySubject(1);
const playerWinsRoundSubject = new ReplaySubject(1);
const playerPlayedCardSubject = new Subject();

// played white cards
currentGameSubject.pipe(
  withLatestFrom(currentPlayerSubject),
  // filter(([game, player]) => game && game?.cZarID === player?.id),
  map(([game]) => [...game.playedWhiteCards.values()].reduce(
    (aggr, curr) => [...aggr, ...curr], [],
  )),
  tap((val) => console.log('playedWhiteCardsSubject =>', val)),
).subscribe(playedWhiteCardsSubject);

// a player plays a white card
combineLatest([
  currentGameSubject.pipe(filter((game) => !!game)),
  playedWhiteCardsSubject,
]).pipe(
  filter(([game]) => game.playedBlackCard
    && game.state === 'playing_cards'
    && game.players.length > 1),
  map(([game, playedWhiteCards]) => [
    game,
    playedWhiteCards.map(({ text }) => text),
  ]),
  pairwise(),
  tap((val) => console.log('a player plays a white card =>', val)),
).subscribe(playerPlayedCardSubject);

// switch to the picking_winner state when all players
// have played required amount of white cards
combineLatest([
  currentGameSubject.pipe(filter((game) => !!game)),
  playedWhiteCardsSubject,
]).pipe(
  filter(([game, playedWhiteCards]) => game.playedBlackCard
    && game.state === 'playing_cards'
    && playedWhiteCards.length
    && game.players.length > 1
    && playedWhiteCards.length === ((game.players.length - 1) * game.playedBlackCard.pick)),
  tap(([game]) => game.setState('picking_winner')),
  tap((val) => console.log('update state =>', val)),
).subscribe(([game]) => {
  from(db.collection('games').doc(game.id).update({ state: game.state }));
});

// switch to the winner_selected state when the cZar has
// selected winner for the current round and emit the player
currentGameSubject.pipe(
  filter((game) => game.playedBlackCard
    && game.state === 'picking_winner'
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


// currentGameSubject.pipe(
//   filter((game) => game.playedBlackCard
//     && game.state === 'picking_winner'
//     && game.players.length > 1),
//   map((game) => [
//     game,
//     [...game.playedWhiteCards.keys()]
//       .map((key) => game.players.find(({ id }) => id === key))
//       .filter((player) => !!player)
//       // for some reasons pairwise operator doesn't play nicely with es6 classes
//       .map(({ id, name, points }) => ({ id, name, points })),
//   ]),
//   filter(([, players]) => !!players.length),
//   pairwise(),
//   map(([[, prev], [game, curr]]) => [
//     game,
//     curr.filter((currItem) => {
//       const player = prev.find((prevItem) => currItem.id === prevItem.id);
//       if (!player)
//         return false;
//       return currItem.points > player.points;
//     }),
//   ]),
//   filter(([, [player]]) => !!player),
//   tap(([, player]) => console.log('playerWinsRoundSubject== =>', player)),
//   tap(([game]) => game.setState('winner_selected')),
//   switchMap(([game, player]) => from(db.collection('games')
//     .doc(game.id).withConverter(converter).update({
//       state: game.state,
//     })
//     .then(() => game.players.find(({ id }) => id === player.id)))),
// ).subscribe(playerWinsRoundSubject);

export {
  playedWhiteCardsSubject,
  playerWinsRoundSubject,
  playerPlayedCardSubject,
};

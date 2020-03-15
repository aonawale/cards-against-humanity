import { ReplaySubject, combineLatest, from } from 'rxjs';
import {
  map, tap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import currentPlayerSubject from 'stream/currentPlayer/currentPlayer';
import currentGameSubject from 'stream/currentGame/currentGame';
import { firestore as db } from 'lib/firebase';
import { converter } from 'game/game';

const playedWhiteCardsSubject = new ReplaySubject(1);
const currentGameStateSubject = new ReplaySubject(1);

currentGameSubject.pipe(
  withLatestFrom(currentPlayerSubject),
  filter(([game, player]) => game && game?.cZarID === player?.id),
  map(([game]) => [...game.playedWhiteCards.values()].reduce(
    (aggr, curr) => [...aggr, ...curr], [],
  )),
  tap((val) => console.log('playedWhiteCardsSubject =>', val)),
).subscribe(playedWhiteCardsSubject);

combineLatest([
  currentGameSubject.pipe(filter((game) => !!game)),
  playedWhiteCardsSubject,
]).pipe(
  tap((val) => console.log('====== =>', val)),
  filter(([game, playedWhiteCards]) => game.playedBlackCard
    && game.state === 'playing_cards'
    && playedWhiteCards.length === ((game.players.length - 1) * game.playedBlackCard.pick)),
  // filter(([{ players, playedBlackCard }, playedWhiteCards]) => playedWhiteCards.length
  // === players.length * playedBlackCard.pick),
  tap(([game]) => game.setState('picking_winner')),
  tap((val) => console.log('====== => =>', val)),
  switchMap(([game]) => from(db.collection('games').doc(game.id).withConverter(converter).set(game))),
).subscribe(() => {});

export {
  // eslint-disable-next-line import/prefer-default-export
  playedWhiteCardsSubject,
};

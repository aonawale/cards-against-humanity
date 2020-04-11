import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import shuffle from 'lib/shuffle';
import Game, { gameStates } from 'game/game';
import Player from 'game/player/player';
import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import CardsStack from 'components/CardsStack/CardsStack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    marginRight: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    '&:last-of-type': {
      marginRight: '0px',
    },
  },
  infoBox: {
    padding: '16px',
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const Info = ({ title, children }) => (
  <Box textAlign="center" py={1}>
    <Typography variant="h5" component="h1">
      {title}
    </Typography>
    <Box className={useStyles().infoBox}>
      {children}
    </Box>
  </Box>
);

Info.propTypes = {
  title: PropTypes.string.isRequired,
};

const normalise = (value) => (value - 0) * (100 / (5 - 0));

const GamePlay = memo(({
  game, currentPlayer, onCZarClickCard, onPlayerClickCard, nextRoundStarting,
}) => {
  const classes = useStyles();
  const currentPlayerIsCzar = currentPlayer.id === game.cZarID;

  const playerNames = useMemo(
    () => {
      const names = game.pendingPlayers.map(({ firstName }) => firstName);
      const formattedNames = names.length > 1
        ? [...names.slice(0, names.length - 2), names.slice(-2).join(' and ')]
        : names;
      return formattedNames.join(', ');
    },
    [game.pendingPlayers],
  );

  const shuffledPlayedWhiteCards = useMemo(
    () => shuffle([...game.playedWhiteCards.values()]),
    [game.playedWhiteCards],
  );

  switch (game.state) {
    case gameStates.playingCards:
      return currentPlayerIsCzar
        ? (
          <Info
            title={playerNames ? `Waiting for ${playerNames} to play...` : 'Waiting for players to join...'}
          />
        )
        : (
          <Info
            title={game.hasPlayedWhiteCards(currentPlayer)
              ? 'Waiting for others to play...'
              : 'Click card to play'}
          >
            {currentPlayer.cards.map((card) => (
              <Card
                key={card.text}
                card={card}
                classes={classes.card}
                isClickable={game.canPlayWhiteCard(currentPlayer, card)}
                onClick={onPlayerClickCard}
              />
            ))}
          </Info>
        );
    case gameStates.pickingWinner:
      return currentPlayerIsCzar
        ? (
          <Info title="Players played cards. Click card to choose a winner.">
            {shuffledPlayedWhiteCards.map((cards) => (
              <CardsStack
                key={cards.map(({ text }) => text).join('')}
                className={classes.card}
                cards={cards}
                onClick={onCZarClickCard}
              />
            ))}
          </Info>
        )
        : <Info title="Waiting for the Czar to choose a winner" />;
    case gameStates.winnerSelected:
      return currentPlayerIsCzar
        ? (
          <Info title={`You choose ${game.roundWinner.firstName} as the winner.`}>
            {game.canPlayNextRound ? (
              <Box>
                <Box mb={2}>Next round starting in...</Box>
                <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                  <Box position="absolute" zIndex={1}>{nextRoundStarting}</Box>
                  <CircularProgress variant="static" value={normalise(nextRoundStarting)}>
                    {nextRoundStarting}
                  </CircularProgress>
                </Box>
              </Box>
            ) : (
              <Typography>
                  The End
              </Typography>
            )}
          </Info>
        )
        : (
          <Info title={`The Czar choose 
            ${game.roundWinnerID === currentPlayer.id ? 'your' : `${game.roundWinner.firstName}'s`} card`}
          >
            {game.roundWinnerCards.map((card) => (
              <Card key={card.text} card={card} classes={classes.card} />
            ))}
          </Info>
        );
    default:
      return null;
  }
});

GamePlay.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  currentPlayer: PropTypes.instanceOf(Player).isRequired,
  onPlayerClickCard: PropTypes.func.isRequired,
  onCZarClickCard: PropTypes.func.isRequired,
  nextRoundStarting: PropTypes.number,
};

export default GamePlay;

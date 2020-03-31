import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Game, { gameStates } from 'game/game';
import Player from 'game/player/player';
import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import CardsStack from 'components/CardsStack/CardsStack';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    marginRight: '16px',
    display: 'inline-block',
  },
  infoBox: {
    padding: '16px',
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'scroll',
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
    {children}
  </Box>
);

Info.propTypes = {
  title: PropTypes.string.isRequired,
};

const GamePlay = memo(({
  game, currentPlayer, onCZarClickCard, onPlayerClickCard, onNextRound,
}) => {
  const classes = useStyles();
  const currentPlayerIsCzar = currentPlayer.id === game.cZarID;
  const playerNames = game.pendingPlayers.map(({ firstName }) => firstName).join(',');

  switch (game.state) {
    case gameStates.playingCards:
      return currentPlayerIsCzar
        ? (
          <Info
            title={playerNames ? `Waiting for ${playerNames} to play...` : 'Waiting for players to join...'}
          />
        )
        : (
          <Info title="Play card">
            <Box className={classes.infoBox}>
              {currentPlayer.cards.map((card) => (
                <Card
                  key={card.text}
                  card={card}
                  classes={classes.card}
                  isClickable={game.canPlayWhiteCard(currentPlayer)}
                  onClick={onPlayerClickCard}
                />
              ))}
            </Box>
          </Info>
        );
    case gameStates.pickingWinner:
      return currentPlayerIsCzar
        ? (
          <Info title="Players played cards. Choose a winner.">
            <Box className={classes.infoBox}>
              {[...game.playedWhiteCards.values()].map((cards) => (
                <CardsStack
                  key={cards.map(({ text }) => text).join('')}
                  classes={classes.card}
                  cards={cards}
                  onClick={onCZarClickCard}
                />
              ))}
            </Box>
          </Info>
        )
        : <Info title="Waiting for the Czar to choose a winner" />;
    case gameStates.winnerSelected:
      return currentPlayerIsCzar
        ? (
          <Info title={`You choose ${game.roundWinner.firstName} as the winner`}>
            <Box className={classes.infoBox}>
              <Button variant="outlined" onClick={onNextRound}>
                Next round
              </Button>
            </Box>
          </Info>
        )
        : (
          <Info title={`The Czar choose 
            ${game.roundWinnerID === currentPlayer.id ? 'your' : `${game.roundWinner.firstName}s`} card`}
          >
            <Box className={classes.infoBox}>
              {game.roundWinnerCards.map((card) => <Card key={card.text} card={card} classes={classes.card} />)}
            </Box>
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
  onNextRound: PropTypes.func.isRequired,
};

export default GamePlay;

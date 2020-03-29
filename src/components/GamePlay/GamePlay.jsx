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
            <Box mt={1} px={2} whiteSpace="nowrap" width="100%" overflow="scroll">
              {currentPlayer?.cards.map((card) => (
                <Card
                  key={card.text}
                  card={card}
                  classes={classes.card}
                  isClickable={currentPlayer && game.canPlayWhiteCard(currentPlayer)}
                  onClick={onPlayerClickCard}
                >
                  <Typography variant="h4" component="h1">
                    {card.text}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Info>
        );
    case gameStates.pickingWinner:
      return currentPlayerIsCzar
        ? (
          <Info title="Players played cards. Choose a winner.">
            <Box mt={1} px={2} whiteSpace="nowrap" width="100%" overflow="scroll">
              {[...game.playedWhiteCards.values()].map((cards) => (
                <CardsStack
                  key={`${Math.random()}`}
                  classes={classes.card}
                  cards={cards}
                  onClick={onCZarClickCard}
                >
                  {(card) => (
                    <Typography variant="h4" component="h1">
                      {card.text}
                    </Typography>
                  )}
                </CardsStack>
              ))}
            </Box>
          </Info>
        )
        : <Info title="Waiting for the Czar to choose a winner" />;
    case gameStates.winnerSelected:
      return currentPlayerIsCzar
        ? (
          <Info title={`You choose ${game.roundWinner.firstName} as the winner`}>
            <Box mt={1} px={2}>
              <Button variant="outlined" onClick={onNextRound}>
                Next round
              </Button>
            </Box>
          </Info>
        )
        : (
          <Info title={`The Czar choose ${game.roundWinner.firstName}'s card`}>
            <Box mt={1} px={2} whiteSpace="nowrap" width="100%" overflow="scroll">
              {game.roundWinnerCards.map((card) => (
                <Card key={card.text} card={card} classes={classes.card}>
                  <Typography variant="h4" component="h1">
                    {card.text}
                  </Typography>
                </Card>
              ))}
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

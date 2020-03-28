import React, { memo, useMemo } from 'react';
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
  <Box textAlign="center" whiteSpace="normal">
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
  const currentPlayerIsCzar = useMemo(
    () => currentPlayer.id === game.cZarID,
    [currentPlayer.id, game.cZarID],
  );

  return (
    <Box p={2} whiteSpace="nowrap" width="100%" height="100%" overflow="scroll">
      {(() => {
        switch (game.state) {
          case gameStates.pickingWinner:
            return currentPlayerIsCzar
              ? [...game.playedWhiteCards.values()].map((cards) => (
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
              ))
              : <Info title="Waiting for the Card Czar to choose a winner" />;
          case gameStates.playingCards:
            return currentPlayerIsCzar
              ? (
                <Info
                  title={`Waiting for ${game.pendingPlayers.map(({ firstName }) => firstName).join(',')} to play...`}
                />
              )
              : currentPlayer?.cards.map((card) => (
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
              ));
          case gameStates.winnerSelected:
            return currentPlayerIsCzar
              ? (
                <Info title="You picked winner!">
                  <Button
                    variant="outlined"
                    onClick={onNextRound}
                  >
                    Next round
                  </Button>
                </Info>
              )
              : <Info title="The Card Czar choose a winner!" />;
          default:
            return null;
        }
      })()}
    </Box>
  );
});

GamePlay.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  currentPlayer: PropTypes.instanceOf(Player).isRequired,
  onPlayerClickCard: PropTypes.func.isRequired,
  onCZarClickCard: PropTypes.func.isRequired,
  onNextRound: PropTypes.func.isRequired,
};

export default GamePlay;

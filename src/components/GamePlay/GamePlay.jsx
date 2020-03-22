import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Game, { gameStates } from 'game/game';
import Player from 'game/player/player';

import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const GamePlay = memo(({
  game, currentPlayer, onCZarClickCard, onPlayerClickCard, onNextRound,
}) => {
  const currentPlayerIsCzar = useMemo(() => currentPlayer.id === game.cZarID, [currentPlayer.id, game.cZarID]);
  return (
    <Box display="flex" width="100%" overflow="scroll">

      {(() => {
        if (game.state === gameStates.pickingWinner) {
          if (currentPlayerIsCzar) {
            return [...game.playedWhiteCards.values()].map((cards) => cards.map((card) => (
              <Box key={card.text} p={2}>
                <Card
                  card={card}
                  onClick={onCZarClickCard}
                  isClickable={currentPlayerIsCzar}
                />
              </Box>
            )));
          }
          return (
            <Box p={2} height="100%" width="100%">
              <Typography variant="h4" component="h1">
                    The CZar is picking a winner
              </Typography>
            </Box>
          );
        }

        if (game.state === gameStates.playingCards) {
          if (currentPlayerIsCzar) {
            return (
              <Box p={2} height="100%" width="100%">
                <Typography variant="h4" component="h1">
                      Players are playing cards
                </Typography>
              </Box>
            );
          }
          return currentPlayer?.cards.map((card) => (
            <Box key={card.text} p={2}>
              <Card
                card={card}
                isClickable={currentPlayer && game.canPlayWhiteCard(currentPlayer)}
                onClick={onPlayerClickCard}
              />
            </Box>
          ));
        }

        if (game.state === gameStates.winnerSelected) {
          if (currentPlayerIsCzar) {
            return (
              <Box p={2} height="100%" width="100%">
                <Typography variant="h4" component="h1">
                  You picked winner!
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onNextRound}
                >
                      Next round
                </Button>
              </Box>
            );
          }
          return (
            <Box p={2} height="100%" width="100%">
              <Typography variant="h4" component="h1">
                Czar choose picked a winner!
              </Typography>
            </Box>
          );
        }

        return null;
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

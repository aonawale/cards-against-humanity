import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardsStack from 'components/CardsStack/CardsStack';

const useStyles = makeStyles({
  cardsStack: {
    marginRight: '16px',
    display: 'inline-block',
  },
  blackCard: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px #fff, 0px 1px 5px 0px rgba(0,0,0,0.12);',
  },
});

const GameDeck = memo(({ whiteCardsDeck, blackCardsDeck }) => {
  const classes = useStyles();
  return (
    <Box py={1} px={2} textAlign="center" whiteSpace="nowrap" height="100%" width="100%" overflow="scroll">
      <CardsStack
        spacing={4}
        isClickable={false}
        classes={classes.cardsStack}
        cardClasses={classes.blackCard}
        cards={blackCardsDeck.cards.slice(0, 5)}
      >
        {() => (
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Typography component="h1" variant="h4">
              Cards Against Humanity
            </Typography>
            <Typography align="center">
              {blackCardsDeck.cards.length} Cards
            </Typography>
          </Box>
        )}
      </CardsStack>

      <CardsStack
        spacing={4}
        isClickable={false}
        classes={classes.cardsStack}
        cards={whiteCardsDeck.cards.slice(0, 5)}
      >
        {() => (
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Typography component="h1" variant="h4">
              Cards Against Humanity
            </Typography>
            <Typography align="center">
              {whiteCardsDeck.cards.length} Cards
            </Typography>
          </Box>
        )}
      </CardsStack>
    </Box>
  );
});

GameDeck.propTypes = {
  whiteCardsDeck: PropTypes.shape({
    cards: PropTypes.arrayOf(Card.propTypes.card),
  }),
  blackCardsDeck: PropTypes.shape({
    cards: PropTypes.arrayOf(Card.propTypes.card),
  }),
};

export default GameDeck;

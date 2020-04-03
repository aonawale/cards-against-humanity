import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardsStack from 'components/CardsStack/CardsStack';
import { cardTypes } from 'game/card/card';

const useStyles = makeStyles({
  cardsStack: {
    marginLeft: '8px',
    marginRight: '8px',
    display: 'inline-block',
    position: 'relative',
    color: '#fff',
  },
  cardsCount: {
    position: 'absolute',
    left: '0px',
    bottom: '32px',
    width: '100%',
  },
  blackCard: {
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px #fff, 0px 1px 5px 0px rgba(0,0,0,0.12);',
  },
});

const generateCards = (type) => [1, 2, 3, 4, 5].map(() => ({ text: 'Cards Against Humanity', type }));

const GameDeck = memo(({ whiteCardsDeck, blackCardsDeck }) => {
  const classes = useStyles();
  return (
    <Box py={2} px={1} textAlign="center" whiteSpace="nowrap" height="100%" width="100%" overflow="scroll">
      <Box className={classes.cardsStack}>
        <CardsStack
          spacing={4}
          isClickable={false}
          cardClasses={classes.blackCard}
          cards={generateCards(cardTypes.black)}
        />
        <Typography className={classes.cardsCount}>
          {blackCardsDeck.count} Cards
        </Typography>
      </Box>

      <Box className={classes.cardsStack}>
        <CardsStack
          spacing={4}
          isClickable={false}
          classes={classes.cardsStack}
          cards={generateCards(cardTypes.white)}
        />
        <Typography color="textPrimary" className={classes.cardsCount}>
          {whiteCardsDeck.count} Cards
        </Typography>
      </Box>
    </Box>
  );
});

GameDeck.propTypes = {
  whiteCardsDeck: PropTypes.shape({
    count: PropTypes.number.isRequired,
  }),
  blackCardsDeck: PropTypes.shape({
    count: PropTypes.number.isRequired,
  }),
};

export default GameDeck;

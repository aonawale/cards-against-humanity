import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardsStack from 'components/CardsStack/CardsStack';
import { cardTypes } from 'game/card/card';

const useStyles = makeStyles({
  root: {
    padding: '16px 8px',
    whiteSpace: 'nowrap',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  cardsStack: {
    marginLeft: '8px',
    marginRight: '8px',
    display: 'inline-block',
    position: 'relative',
    color: '#fff',
    verticalAlign: 'top',
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

const generateCards = (type, count) => [...new Array(count).keys()].map(
  () => ({ text: 'Cards Against Humanity', type }),
);

const GameDeck = memo(({ whiteCardsDeck, blackCardsDeck }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.cardsStack}>
        <CardsStack
          spacing={4}
          isClickable={false}
          cardClasses={classes.blackCard}
          cards={generateCards(cardTypes.black, Math.min(blackCardsDeck.count || 1, 5))}
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
          cards={generateCards(cardTypes.white, Math.min(whiteCardsDeck.count || 1, 5))}
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

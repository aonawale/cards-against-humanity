import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card';
import CardPaper, { cardTypes } from 'components/CardPaper/CardPaper';

const useStyles = makeStyles({
  deck: {
    position: 'relative',
    width: '200px',
    height: '260px',
  },
});

const useCardStyles = makeStyles({
  root: (props) => ({
    position: 'absolute',
    // top: 0,
    ...props,
  }),
  text: {
    wordWrap: 'break-word',
  },
});

const Deck = memo(({ cards, type }) => {
  const classes = useStyles();

  return (
    <div className={classes.deck}>
      {cards.slice(0, 5).map(({ text }, index) => {
        const { root, text: textStyle } = useCardStyles({ bottom: index * 2, left: 0 });
        return (
          <CardPaper
            key={text}
            type={type}
            classes={root}
            elevation={2}
          >
            <Box p={2}>
              <Typography variant="h4" component="h1" className={textStyle}>
                Cards Against Humanity
              </Typography>
            </Box>
          </CardPaper>
        );
      })}
    </div>
  );
});

Deck.defaultProps = {
  type: cardTypes.white,
};

Deck.propTypes = {
  cards: PropTypes.arrayOf(Card.propTypes.card),
  type: PropTypes.oneOf([...Object.values(cardTypes)]),
};

export default Deck;

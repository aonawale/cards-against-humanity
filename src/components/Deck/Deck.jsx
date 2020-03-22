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
      {[1, 2, 3, 4, 5].map((item, index) => {
        const boxShadow = index % 2 === 0
          ? '0px 3px 1px -2px #fff, 0px 2px 2px 0px #fff, 0px 1px 5px 0px #fff;'
          : '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);';

        const styles = {};

        if (type === cardTypes.black)
          styles.boxShadow = boxShadow;

        const { root, text: textStyle } = useCardStyles({
          bottom: index * 2,
          left: 0,
          ...styles,
        });
        return (
          <CardPaper
            key={item}
            type={type}
            classes={root}
            elevation={2}
          >
            {index === 4 && (
              <Box p={2} display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                <Typography
                  component="h1"
                  variant="h4"
                  className={textStyle}
                >
                  Cards Against Humanity
                </Typography>

                <Typography
                  align="center"
                >
                  {cards.length} Cards
                </Typography>
              </Box>
            )}
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

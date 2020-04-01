import React, {
  memo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: (props) => ({
    position: 'relative',
    width: '200px',
    height: '260px',
    ...props,
  }),
});

const useCardStyles = makeStyles({
  root: (props) => ({
    position: 'absolute',
    ...props,
  }),
});

const CardsStack = memo(({
  cards: _cards, classes: _classes, spacing, isClickable, cardClasses, onClick,
}) => {
  const classes = useStyles({
    height: `${260 + (_cards.length * spacing)}px`,
  });
  const [cards, setCards] = useState(_cards.slice());
  const lastIndex = cards.length - 1;

  const handleCardClick = useCallback((card) => {
    const index = cards.indexOf(card);
    if (index !== (cards.length - 1)) {
      cards.push(cards.splice(index, 1)[0]);
      setCards([...cards]);
    } else if (onClick)
      onClick(card);
  }, [cards, onClick]);

  return (
    <div className={`${classes.root} ${_classes}`}>
      {cards.map((card, index) => {
        const { root } = useCardStyles({
          top: (lastIndex - index) * spacing,
          left: 0,
        });
        return (
          <Card
            classes={`${root} ${cardClasses}`}
            // eslint-disable-next-line react/no-array-index-key
            key={`${card.text}${index}`}
            card={card}
            isClickable={isClickable}
            onClick={handleCardClick}
          />
        );
      })}
    </div>
  );
});

CardsStack.defaultProps = {
  spacing: 16,
  isClickable: true,
};

CardsStack.propTypes = {
  cards: PropTypes.arrayOf(Card.propTypes.card).isRequired,
  spacing: PropTypes.number,
  isClickable: PropTypes.bool,
  classes: PropTypes.string,
  cardClasses: PropTypes.string,
  onClick: PropTypes.func,
};

export default CardsStack;

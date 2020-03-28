import React, {
  memo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Card, { cardTypes } from 'components/Card/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '200px',
    height: '100%',
  },
});

const useCardStyles = makeStyles({
  root: (props) => ({
    position: 'absolute',
    ...props,
  }),
});

const CardsStack = memo(({
  cards: _cards, type, spacing, cardClasses, onClick, children,
}) => {
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
    <div className={useStyles().root}>
      {cards.map((card, index) => {
        const { root } = useCardStyles({
          top: (lastIndex - index) * spacing,
          left: 0,
        });
        return (
          <Card
            classes={`${root} ${cardClasses}`}
            key={card.text}
            card={card}
            type={type}
            isClickable
            onClick={handleCardClick}
          >
            {children(card)}
          </Card>
        );
      })}
    </div>
  );
});

CardsStack.defaultProps = {
  spacing: 16,
};

CardsStack.propTypes = {
  cards: PropTypes.arrayOf(Card.propTypes.card).isRequired,
  type: PropTypes.oneOf([...Object.values(cardTypes)]),
  spacing: PropTypes.number,
  cardClasses: PropTypes.string,
  onClick: PropTypes.func,
};

export default CardsStack;

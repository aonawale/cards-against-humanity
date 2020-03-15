import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardPaper, { cardTypes } from 'components/CardPaper/CardPaper';

const useStyles = makeStyles({
  root: (props) => ({
    ...props,
  }),
  text: {
    wordWrap: 'break-word',
  },
});

const Card = memo(({
  card, type, onClick, isClickable,
}) => {
  const classes = useStyles({
    cursor: isClickable ? 'pointer' : 'default',
  });

  const [isActive, setIsActive] = useState(false);

  const handleItemBlur = useCallback(() => setIsActive(false), [setIsActive]);
  const handleItemFocus = useCallback(() => setIsActive(true), [setIsActive]);

  const handleClick = useCallback(() => {
    if (isClickable && onClick)
      onClick(card);
  }, [card, isClickable, onClick]);

  return (
    <CardPaper
      type={type}
      classes={classes.root}
      elevation={isActive ? 4 : 2}
      onClick={handleClick}
      onMouseEnter={handleItemFocus}
      onMouseLeave={handleItemBlur}
    >
      <Box p={2}>
        <Typography variant="h4" component="h1" className={classes.text}>
          {card.text}
        </Typography>
      </Box>
    </CardPaper>
  );
});

Card.defaultProps = {
  type: cardTypes.white,
  isClickable: false,
};

Card.propTypes = {
  card: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.oneOf([...Object.values(cardTypes)]),
  isClickable: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;

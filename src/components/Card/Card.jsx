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

const Card = memo(({ card, type, isClickable }) => {
  const classes = useStyles({
    cursor: isClickable ? 'pointer' : 'default',
  });

  const [isActive, setIsActive] = useState(false);

  const handleItemBlur = useCallback(() => setIsActive(false), [setIsActive]);
  const handleItemFocus = useCallback(() => setIsActive(true), [setIsActive]);

  return (
    <CardPaper
      type={type}
      classes={classes.root}
      elevation={isActive ? 4 : 2}
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
};

export default Card;

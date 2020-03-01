import React, { memo, useState, useCallback } from 'react'
import PropTypes from 'prop-types';
import MuiCard from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const cardTypes = {
  white: Symbol('white'),
  black: Symbol('black'),
};

const useStyles = makeStyles({
  root: props => ({
    width: '200px',
    height: '260px',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '16px',
    ...props
  }),
});

const Card = memo(({ text, type }) => {
  const classes = useStyles({
    color: type === cardTypes.black ? 'white' : 'black',
    backgroundColor: type === cardTypes.black ? 'black' : 'white'
  });

  const [isActive, setIsActive] = useState(false);

  const handleItemBlur = useCallback(() => setIsActive(false), [setIsActive]);
  const handleItemFocus = useCallback(() => setIsActive(true), [setIsActive]);

  return (
    <MuiCard 
      classes={classes}
      raised={isActive}
      onMouseEnter={handleItemFocus}
      onMouseLeave={handleItemBlur}
    >
      <CardContent>
        <Typography variant="h4" component="h1">
          {text}
        </Typography>
      </CardContent>
    </MuiCard>
  );
});

Card.defaultProps = {
  type: cardTypes.white,
};

Card.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf([...Object.values(cardTypes)]).isRequired
};

export default Card;

export {
  cardTypes
};
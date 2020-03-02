import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const cardTypes = {
  white: Symbol('white'),
  black: Symbol('black'),
};

const useStyles = makeStyles({
  root: (props) => ({
    width: '200px',
    height: '260px',
    borderRadius: '8px',
    cursor: 'pointer',
    ...props,
  }),
  text: {
    wordWrap: 'break-word',
  },
});

const Card = memo(({ text, type }) => {
  const classes = useStyles({
    color: type === cardTypes.black ? 'white' : 'black',
    backgroundColor: type === cardTypes.black ? 'black' : 'white',
  });

  const [isActive, setIsActive] = useState(false);

  const handleItemBlur = useCallback(() => setIsActive(false), [setIsActive]);
  const handleItemFocus = useCallback(() => setIsActive(true), [setIsActive]);

  return (
    <Paper
      elevation={isActive ? 4 : 2}
      className={classes.root}
      onMouseEnter={handleItemFocus}
      onMouseLeave={handleItemBlur}
    >
      <Box p={2}>
        <Typography variant="h4" component="h1" className={classes.text}>
          {text}
        </Typography>
      </Box>
    </Paper>
  );
});

Card.defaultProps = {
  type: cardTypes.white,
};

Card.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf([...Object.values(cardTypes)]),
};

export default Card;
export {
  cardTypes,
};

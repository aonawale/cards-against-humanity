import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
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
    cursor: 'default',
    ...props,
  }),
  content: {
    wordWrap: 'break-word',
    userSelect: 'none',
    height: '100%',
    overflow: 'hidden',
  },
});

const Card = memo(({
  card, type, classes, onClick, isClickable, children,
}) => {
  const { root, content } = useStyles({
    color: type === cardTypes.black ? 'white' : 'black',
    backgroundColor: type === cardTypes.black ? 'black' : 'white',
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
    <Paper
      className={`${root} ${classes}`}
      elevation={isActive ? 4 : 2}
      onClick={handleClick}
      onMouseEnter={handleItemFocus}
      onMouseLeave={handleItemBlur}
    >
      <Box p={2} className={content}>
        {children}
      </Box>
    </Paper>
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
  classes: PropTypes.string,
  isClickable: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;

export {
  cardTypes,
};

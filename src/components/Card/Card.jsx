import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cardTypes } from 'game/card/card';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Textfit } from 'react-textfit';

const useStyles = makeStyles({
  root: (props) => ({
    width: '200px',
    height: '260px',
    borderRadius: '8px',
    cursor: 'default',
    padding: '16px',
    ...props,
  }),
  content: {
    wordWrap: 'break-word',
    textAlign: 'left',
    whiteSpace: 'normal',
    userSelect: 'none',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
});

const Card = memo(({
  card, classes, onClick, isClickable,
}) => {
  const { root, content } = useStyles({
    color: card.type === cardTypes.black ? 'white' : 'black',
    backgroundColor: card.type === cardTypes.black ? 'black' : 'white',
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
      <Box className={content}>
        <Textfit mode="multi" style={{ width: '100%', height: '100%', display: 'flex' }} max={33}>
          {card.text}
        </Textfit>
      </Box>
    </Paper>
  );
});

Card.defaultProps = {
  isClickable: false,
};

Card.propTypes = {
  card: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf([...Object.values(cardTypes)]).isRequired,
  }).isRequired,
  classes: PropTypes.string,
  isClickable: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;

export {
  cardTypes,
};

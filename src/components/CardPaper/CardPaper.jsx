import React, { memo } from 'react';
import PropTypes from 'prop-types';
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
});

const CardPaper = memo(({
  type, classes, children, ...rest
}) => {
  const { root } = useStyles({
    color: type === cardTypes.black ? 'white' : 'black',
    backgroundColor: type === cardTypes.black ? 'black' : 'white',
    boxShadow: type === cardTypes.black
      ? '0px 3px 1px -2px #fff, 0px 2px 2px 0px #fff, 0px 1px 5px 0px #fff;'
      : '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);',
  });

  return (
    <Paper
      className={`${root} ${classes}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {children}
    </Paper>
  );
});

CardPaper.propTypes = {
  type: PropTypes.oneOf([...Object.values(cardTypes)]).isRequired,
  classes: PropTypes.string,
};

export default CardPaper;
export {
  cardTypes,
};

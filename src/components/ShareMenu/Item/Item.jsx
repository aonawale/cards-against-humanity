import React, {
  memo, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const Item = memo(forwardRef(({
  icon, text, Component, ...rest
}, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Component button ref={ref} {...rest}>
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
  </Component>
)));

Item.muiName = MenuItem.muiName;

Item.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default Item;

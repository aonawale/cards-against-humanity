import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const PlayersListItem = memo(({ player }) => (
  <ListItem alignItems="flex-start">
    <ListItemAvatar>
      <Avatar alt={player.name} src={player.photoURL} />
    </ListItemAvatar>
    <ListItemText
      primary={player.name}
      secondary={`${player.points} Points`}
    />
  </ListItem>
));

PlayersListItem.propsStructure = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    photoURL: PropTypes.string,
  }),
};

PlayersListItem.propTypes = {
  ...PlayersListItem.playerPropsTypes,
};

export default PlayersListItem;

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import PlayersListItem from 'components/PlayersListItem/PlayersListItem';

const PlayersList = memo(({ players }) => (
  <List dense>
    {players.map((player) => (
      <PlayersListItem
        key={player.id}
        player={player}
      />
    ))}
  </List>
));

PlayersList.defaultProps = {
  players: [],
};

PlayersList.propTypes = {
  players: PropTypes.arrayOf(PlayersListItem.propTypes.player),
};

export default PlayersList;

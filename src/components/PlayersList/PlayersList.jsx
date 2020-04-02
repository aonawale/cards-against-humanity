import React, { memo } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import PlayersListItem from 'components/PlayersListItem/PlayersListItem';

const PlayersList = memo(({ players }) => (
  <Container maxWidth="sm">
    <List dense>
      {players.map((player) => (
        <PlayersListItem
          key={player.id}
          player={player}
        />
      ))}
    </List>
  </Container>
));

PlayersList.defaultProps = {
  players: [],
};

PlayersList.propTypes = {
  players: PropTypes.arrayOf(PlayersListItem.propsStructure.player),
};

export default PlayersList;

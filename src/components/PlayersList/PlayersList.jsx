import React, { memo } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import PlayersListItem from 'components/PlayersList/Item/Item';

const PlayersList = memo(({ players, canRemovePlayer, onRemovePlayer }) => (
  <Container maxWidth="sm">
    <List dense>
      {players.map((player) => (
        <PlayersListItem
          key={player.id}
          player={player}
          onRemove={onRemovePlayer}
          canRemove={canRemovePlayer(player)}
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
  onRemovePlayer: PropTypes.func.isRequired,
  canRemovePlayer: PropTypes.func.isRequired,
};

export default PlayersList;

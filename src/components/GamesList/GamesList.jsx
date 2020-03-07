import React, { memo } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import GamesListItem from 'components/GamesListItem/GamesListItem';

const GamesList = memo(({ games, onClickGame, onDeleteGame }) => (
  <List>
    {games.map((game) => (
      <GamesListItem
        key={game.id}
        game={game}
        onClick={onClickGame}
        onDelete={onDeleteGame}
      />
    ))}
  </List>
));

GamesList.defaultProps = {
  games: [],
};

GamesList.propTypes = {
  games: PropTypes.arrayOf(GamesListItem.propTypes.game),
  onClickGame: PropTypes.func,
  onDeleteGame: PropTypes.func,
};

export default GamesList;

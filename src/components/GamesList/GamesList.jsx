import React, { memo } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import GamesListItem from 'components/GamesListItem/GamesListItem';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const GamesList = memo(({
  games, currentUser, onClickGame, onDeleteGame,
}) => (
  <Box paddingY={2}>
    <Box paddingX={2}>
      <Typography variant="h4" component="h1">
        Games
      </Typography>
    </Box>
    <List>
      {games.map((game) => (
        <GamesListItem
          key={game.id}
          game={game}
          onClick={onClickGame}
          onDelete={onDeleteGame}
          canDelete={game.ownerID === currentUser?.id}
        />
      ))}
    </List>
  </Box>
));

GamesList.defaultProps = {
  games: [],
};

GamesList.propTypes = {
  games: PropTypes.arrayOf(GamesListItem.propTypes.game),
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onClickGame: PropTypes.func,
  onDeleteGame: PropTypes.func,
};

export default GamesList;

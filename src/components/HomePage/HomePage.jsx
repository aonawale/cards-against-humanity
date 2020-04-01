import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import startGame from 'stream/gamesList/startGame/startGame';
import deleteGame from 'stream/gamesList/deleteGame/deleteGame';
import gamesListSubject from 'stream/gamesList/gamesList';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import GamesList from 'components/GamesList/GamesList';
import GameStartDialog from 'components/GameStartDialog/GameStartDialog';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const history = useHistory();
  const [gamesList, setGamesList] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [startDialogIsOpen, setStartDialogIsOpen] = useState(false);

  // bind component state to game data stream
  useEffect(() => {
    const subscriptions = [];
    subscriptions.push(gamesListSubject.subscribe(setGamesList));
    subscriptions.push(currentUserSubject.subscribe(setCurrentUser));
    return () => subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, []);

  const handleNewGame = useCallback(() => {
    setStartDialogIsOpen(true);
  }, []);

  const handleClickGame = useCallback(({ id }) => {
    history.push(`games/${id}`);
  }, [history]);

  const handleDeleteGame = useCallback(({ id }) => {
    deleteGame(id);
  }, []);

  const handleConfirmStartDialog = useCallback(({ name }) => {
    const id = startGame(name);
    history.push(`games/${id}`);
  }, [history]);

  const handleCloseStartDialog = useCallback(() => {
    setStartDialogIsOpen(false);
  }, []);

  return (
    <Container>
      {gamesList.length ? (
        <GamesList
          games={gamesList}
          currentUser={currentUser}
          onClickGame={handleClickGame}
          onDeleteGame={handleDeleteGame}
        />
      ) : null}

      <GameStartDialog
        isOpen={startDialogIsOpen}
        onClose={handleCloseStartDialog}
        onStart={handleConfirmStartDialog}
      />

      <Tooltip title="New Game" aria-label="New Game">
        <Zoom in unmountOnExit timeout={transitionDuration} className={classes.fab}>
          <Fab color="primary" aria-label="add" onClick={handleNewGame}>
            <AddIcon />
          </Fab>
        </Zoom>
      </Tooltip>
    </Container>
  );
};

export default HomePage;

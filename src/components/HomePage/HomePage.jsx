import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import startGame from 'stream/gamesList/startGame/startGame';
import deleteGame from 'stream/gamesList/deleteGame/deleteGame';
import gamesListSubject from 'stream/gamesList/gamesList';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import GamesList from 'components/GamesList/GamesList';
import GameStartDialog from 'components/GameStartDialog/GameStartDialog';

const HomePage = () => {
  const history = useHistory();
  const [gamesList, setGamesList] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [startDialogIsOpen, setStartDialogIsOpen] = useState(false);

  useEffect(() => {
    const subscription = gamesListSubject.subscribe(setGamesList);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
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
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleNewGame}
      >
        New Game
      </Button>

      <GamesList
        games={gamesList}
        currentUser={currentUser}
        onClickGame={handleClickGame}
        onDeleteGame={handleDeleteGame}
      />

      <GameStartDialog
        isOpen={startDialogIsOpen}
        onClose={handleCloseStartDialog}
        onStart={handleConfirmStartDialog}
      />
    </>
  );
};

export default HomePage;

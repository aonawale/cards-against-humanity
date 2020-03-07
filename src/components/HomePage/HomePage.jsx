import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import startGame from 'stream/startGame/startGame';
import gamesListSubject from 'stream/gamesList/gamesList';
import GamesList from 'components/GamesList/GamesList';
import GameStartDialog from 'components/GameStartDialog/GameStartDialog';

const HomePage = () => {
  const history = useHistory();
  const [gamesList, setGamesList] = useState([]);
  const [startDialogIsOpen, setStartDialogIsOpen] = useState(false);

  useEffect(() => {
    const subscription = gamesListSubject.subscribe(setGamesList);
    return () => subscription.unsubscribe();
  }, []);

  const handleNewGame = useCallback(() => {
    setStartDialogIsOpen(true);
  }, []);

  const handleClickGame = useCallback(({ id }) => {
    // history.push(`games/${id}`);
  }, []);

  const handleDeleteGame = useCallback(({ id }) => {
    console.log(id);
    setStartDialogIsOpen(false);
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

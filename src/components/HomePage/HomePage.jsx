import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import startGame from 'stream/startGame/startGame';
import gamesListSubject from 'stream/gamesList/firebaseGamesList';
import GamesList from 'components/GamesList/GamesList';

const HomePage = () => {
  const history = useHistory();
  const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    const subscription = gamesListSubject.subscribe(setGamesList);
    return () => subscription.unsubscribe();
  }, []);

  const handleNewGame = useCallback(() => {
    const id = startGame();
    history.push(`games/${id}`);
  }, [history]);

  const handleClickGame = useCallback(({ id }) => {
    // history.push(`games/${id}`);
  }, []);

  const handleDeleteGame = useCallback(({ id }) => {
    console.log(id);
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
    </>
  );
};

export default HomePage;

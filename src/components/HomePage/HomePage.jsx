import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();

  const handleNewGame = useCallback(() => {
    history.push('game');
  }, [history]);

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
    </>
  );
};

export default HomePage;

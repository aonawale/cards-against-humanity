import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { firebaseApp } from 'lib/firebase';

const HomePage = () => {
  const history = useHistory();

  const handleNewGame = useCallback(() => {
    const { id } = firebaseApp.firestore().collection('games').doc();
    history.push(`games/${id}`);
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

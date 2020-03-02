import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Card, { cardTypes } from 'components/Card/Card';
import { blackCardsListSubject, whiteCardsListSubject } from 'stream/cardsList/cardsList';

const GamePage = () => {
  const [whiteCards, setWhiteCards] = useState([]);
  const [blackCards, setBlackCards] = useState([]);

  useEffect(() => {
    const subscription = whiteCardsListSubject.subscribe(setWhiteCards);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = blackCardsListSubject.subscribe(setBlackCards);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Grid container spacing={4} justify="center">
      {whiteCards.slice(0, 10).map((card) => (
        <Grid item key={card.text}>
          <Card text={card.text} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GamePage;

import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
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

  const index = Math.round(Math.random() * blackCards.length);

  return (
    <Box p={2}>
      <Grid container spacing={4} justify="center">
        {blackCards[index] && (
          <Grid item key={blackCards[index].text}>
            <Card text={blackCards[index].text} type={cardTypes.black} />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={4} justify="center">
        {whiteCards.slice(0, 3).map((card) => (
          <Grid item key={card.text}>
            <Card text={card.text} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GamePage;

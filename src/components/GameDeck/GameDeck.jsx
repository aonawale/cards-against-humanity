import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import Deck from 'components/Deck/Deck';
import { cardTypes } from 'components/CardPaper/CardPaper';

const GameDeck = memo(({ whiteCardsDeck, blackCardsDeck }) => (
  <Box display="flex" width="100%" justifyContent="center" overflow="scroll">
    {blackCardsDeck && (
      <Box p={2}>
        <Deck
          type={cardTypes.black}
          cards={blackCardsDeck.cards}
        />
      </Box>
    )}

    {whiteCardsDeck && (
      <Box p={2}>
        <Deck
          cards={whiteCardsDeck.cards}
        />
      </Box>
    )}
  </Box>
));

GameDeck.propTypes = {
  whiteCardsDeck: PropTypes.shape({
    cards: PropTypes.arrayOf(Card.propTypes.card),
  }),
  blackCardsDeck: PropTypes.shape({
    cards: PropTypes.arrayOf(Card.propTypes.card),
  }),
};

export default GameDeck;

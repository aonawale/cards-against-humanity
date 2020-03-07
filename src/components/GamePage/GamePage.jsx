import React, {
  memo, useState, useEffect, useCallback,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import Deck from 'components/Deck/Deck';
import TabPanel from 'components/TabPanel/TabPanel';
import PlayersList from 'components/PlayersList/PlayersList';
import GameJoinDialog from 'components/GameJoinDialog/GameJoinDialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { cardTypes } from 'components/CardPaper/CardPaper';
import { selectGame } from 'stream/gamesList/gamesList';
import joinGame from 'stream/gamesList/joinGame/joinGame';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';
import currentPlayerSubject from 'stream/gamesList/currentPlayer/currentPlayer';
import { currentUserSubject } from 'stream/currentUser/currentUser';

const GamePage = memo(() => {
  const history = useHistory();
  const { gameID } = useParams();
  const [selectedGame, setSelectedGame] = useState();
  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);

  useEffect(() => {
    selectGame(gameID);
  }, [gameID]);

  useEffect(() => {
    const subscription = selectedGameSubject.subscribe(setSelectedGame);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = currentPlayerSubject.subscribe(setCurrentPlayer);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setJoinDialogIsOpen(selectedGame && currentUser && !selectedGame.hasPlayer(currentUser.id));
  }, [currentUser, selectedGame]);

  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleConfirmJoinDialog = useCallback(() => {
    joinGame(gameID);
  }, [gameID]);

  const handleCloseJoinDialog = useCallback(() => {
    history.push('games');
  }, [history]);

  return (
    <Box p={2}>
      <Grid container spacing={4} justify="center">

        {selectedGame?.playedBlackCard && (
          <Grid item>
            <Card
              type={cardTypes.black}
              card={selectedGame.playedBlackCard}
            />
          </Grid>
        )}

      </Grid>

      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="My Cards" />
        <Tab label="Players" />
        <Tab label="Deck" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Box display="flex" width="100%" overflow="scroll">
          {currentPlayer?.cards.map((card) => (
            <Box key={card.text} p={2}>
              <Card
                card={card}
                isClickable={selectedGame?.cZarID !== currentPlayer?.id}
              />
            </Box>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <PlayersList
          players={selectedGame?.players}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Box display="flex" width="100%" justifyContent="center">
          {selectedGame?.blackCardsDeck && (
            <Box p={2}>
              <Deck
                type={cardTypes.black}
                cards={selectedGame?.blackCardsDeck.cards}
              />
            </Box>
          )}

          {selectedGame?.whiteCardsDeck && (
            <Box p={2}>
              <Deck
                cards={selectedGame?.whiteCardsDeck.cards}
              />
            </Box>
          )}
        </Box>
      </TabPanel>

      <GameJoinDialog
        isOpen={joinDialogIsOpen}
        onClose={handleCloseJoinDialog}
        onStart={handleConfirmJoinDialog}
      />
    </Box>
  );
});

export default GamePage;

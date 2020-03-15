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
import joinGame, { playerJoinedGameSubject } from 'stream/gamesList/joinGame/joinGame';
import playCard, { playerPlayedCardSubject } from 'stream/gamesList/playCard/playCard';
import selectedGameSubject from 'stream/gamesList/selectedGame/selectedGame';
import currentPlayerSubject from 'stream/gamesList/currentPlayer/currentPlayer';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { useSnackbar } from 'notistack';

const GamePage = memo(() => {
  const history = useHistory();
  const { gameID } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedGame, setSelectedGame] = useState();
  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);

  useEffect(() => {
    selectGame(gameID);
  }, [gameID]);

  // bind component state to selectedGameSubject
  useEffect(() => {
    const subscription = selectedGameSubject.subscribe(setSelectedGame);
    return () => subscription.unsubscribe();
  }, []);

  // bind component state to currentPlayerSubject
  useEffect(() => {
    const subscription = currentPlayerSubject.subscribe(setCurrentPlayer);
    return () => subscription.unsubscribe();
  }, []);

  // bind component state to currentUserSubject
  useEffect(() => {
    const subscription = currentUserSubject.subscribe(setCurrentUser);
    return () => subscription.unsubscribe();
  }, []);

  // listen for player join game
  useEffect(() => {
    const subscription = playerJoinedGameSubject.subscribe((player) => {
      const message = player.id === currentPlayer?.id
        ? 'You joined game'
        : `${player.name} joined game`;
      enqueueSnackbar(message);
    });
    return () => subscription.unsubscribe();
  }, [currentPlayer, enqueueSnackbar]);

  // listen for player play card event
  useEffect(() => {
    const subscription = playerPlayedCardSubject.subscribe(({ player }) => {
      // const message = player.id === currentPlayer?.id
      //   ? 'You played a card'
      //   : `${player.name} played a card`;
      // console.log(message);
      // enqueueSnackbar(message);
    });
    return () => subscription.unsubscribe();
  }, [currentPlayer, enqueueSnackbar]);

  useEffect(() => {
    setJoinDialogIsOpen(!!(selectedGame && currentUser && !selectedGame.hasPlayer(currentUser.id)));
  }, [currentUser, selectedGame]);

  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleConfirmJoinDialog = useCallback(() => {
    joinGame(gameID);
  }, [gameID]);

  const handleCloseJoinDialog = useCallback(() => {
    setJoinDialogIsOpen(false);
    history.replace('/');
  }, [history]);

  const handleCardClick = useCallback((card) => {
    playCard(card);
  }, []);

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
        <Tab label="Game" />
        <Tab label="My Cards" />
        <Tab label="Players" />
        <Tab label="Deck" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Box display="flex" width="100%" overflow="scroll">
          {(currentPlayer?.id === selectedGame?.cZarID) && (
            'Players are playing'
          )}
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Box display="flex" width="100%" overflow="scroll">
          {currentPlayer?.cards.map((card) => (
            <Box key={card.text} p={2}>
              <Card
                card={card}
                isClickable
                // isClickable={currentPlayer && selectedGame?.canPlayWhiteCard(currentPlayer)}
                onClick={handleCardClick}
              />
            </Box>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <PlayersList
          players={selectedGame?.players}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
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
        gameName={selectedGame?.name || ''}
        onClose={handleCloseJoinDialog}
        onConfirm={handleConfirmJoinDialog}
      />
    </Box>
  );
});

export default GamePage;

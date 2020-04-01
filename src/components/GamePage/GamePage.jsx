import React, {
  memo, useState, useEffect, useCallback,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from 'components/Card/Card';
import TabPanel from 'components/TabPanel/TabPanel';
import PlayersList from 'components/PlayersList/PlayersList';
import GameDeck from 'components/GameDeck/GameDeck';
import GamePlay from 'components/GamePlay/GamePlay';
import GameSettings from 'components/GameSettings/GameSettings';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { selectGame } from 'stream/gamesList/gamesList';
import joinGame, { playerJoinedGameSubject } from 'stream/gamesList/joinGame/joinGame';
import pickWinner from 'stream/currentGame/pickWinner/pickWinner';
import playCard, { playerPlayedCardSubject } from 'stream/currentGame/playCard/playCard';
import nextRound from 'stream/currentGame/nextRound/nextRound';
import leaveGame, { playerLeaveGameSubject } from 'stream/currentGame/leaveGame/leaveGame';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { useSnackbar } from 'notistack';

const GamePage = memo(() => {
  const history = useHistory();
  const { gameID } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [currentGame, setcurrentGame] = useState();
  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);

  useEffect(() => {
    selectGame(gameID);
    return () => selectGame(undefined);
  }, [gameID]);

  // bind component state to game data stream
  useEffect(() => {
    const subscriptions = [];
    subscriptions.push(currentGameSubject.subscribe(setcurrentGame));
    subscriptions.push(currentPlayerSubject.subscribe(setCurrentPlayer));
    subscriptions.push(currentUserSubject.subscribe(setCurrentUser));
    return () => subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, []);

  // listen for game play events
  useEffect(() => {
    const subscriptions = [];
    // listen for player join game
    subscriptions.push(playerJoinedGameSubject.subscribe((player) => {
      if (player.id !== currentPlayer?.id)
        enqueueSnackbar(`${player.firstName} joined game`);
    }));
    // listen for player play card event
    subscriptions.push(playerPlayedCardSubject.subscribe((player) => {
      if (player.id !== currentPlayer?.id)
        enqueueSnackbar(`${player.firstName} played a card`);
    }));
    // listen for player leaves game event
    subscriptions.push(playerLeaveGameSubject.subscribe((player) => {
      if (player.id !== currentPlayer?.id)
        enqueueSnackbar(`${player.firstName} left game`);
    }));
    return () => subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [currentPlayer, enqueueSnackbar]);

  useEffect(() => {
    setJoinDialogIsOpen(!!(currentGame && currentUser && !currentGame.hasPlayer(currentUser.id)));
  }, [currentUser, currentGame]);

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

  const handlePlayerClickCard = useCallback((card) => {
    playCard(card);
  }, []);

  const handleCZarClickCard = useCallback((card) => {
    pickWinner(card);
  }, []);

  const handleNextRound = useCallback(() => {
    nextRound();
  }, []);

  const handleLeaveGame = useCallback(() => {
    leaveGame();
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {currentGame?.playedBlackCard && (
        <Box p={1} display="flex" justifyContent="center">
          <Card
            card={currentGame?.playedBlackCard}
          >
            <Typography variant="h4" component="h1">
              {currentGame?.playedBlackCard?.text}
            </Typography>
          </Card>
        </Box>
      )}

      <Tabs centered value={currentTab} onChange={handleTabChange}>
        <Tab label="Game" />
        <Tab label="Deck" />
        <Tab label="Players" />
        <Tab label="Settings" />
      </Tabs>

      <Box width="100%" flex="1">
        <TabPanel value={currentTab} index={0}>
          {(currentGame && currentPlayer) && (
            <GamePlay
              game={currentGame}
              currentPlayer={currentPlayer}
              onPlayerClickCard={handlePlayerClickCard}
              onCZarClickCard={handleCZarClickCard}
              onNextRound={handleNextRound}
            />
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {currentGame?.whiteCardsDeck && currentGame?.blackCardsDeck && (
            <GameDeck
              whiteCardsDeck={currentGame?.whiteCardsDeck}
              blackCardsDeck={currentGame?.blackCardsDeck}
            />
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <PlayersList
            players={currentGame?.players}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <GameSettings
            onLeaveGame={handleLeaveGame}
          />
        </TabPanel>
      </Box>

      <AlertDialog
        open={joinDialogIsOpen}
        title="Join this game?"
        cancelText="No, I want my mummy"
        confirmText="Bring it on!"
        onCancel={handleCloseJoinDialog}
        onConfirm={handleConfirmJoinDialog}
      >
        {`Join to play ${currentGame?.name ?? ''} Game`}
      </AlertDialog>
    </Box>
  );
});

export default GamePage;

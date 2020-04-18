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
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';

import deleteGame from 'stream/gamesList/deleteGame/deleteGame';
import { selectGame, selectedGameExistSubject } from 'stream/gamesList/gamesList';
import joinGame, { playerJoinedGameSubject } from 'stream/gamesList/joinGame/joinGame';
import pickWinner from 'stream/currentGame/pickWinner/pickWinner';
import playCard, { playerPlayedCardSubject } from 'stream/currentGame/playCard/playCard';
import nextRoundStartingSubject from 'stream/currentGame/nextRound/nextRound';
import leaveGame, { removePlayer, playerLeaveGameSubject } from 'stream/currentGame/leaveGame/leaveGame';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentGame/currentPlayer/currentPlayer';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { useSnackbar } from 'notistack';
import OverlayLoader from 'components/OverlayLoader/OverlayLoader';
import useDialog from 'hooks/dialog';

const GamePage = memo(() => {
  const history = useHistory();
  const { gameID } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [currentGame, setcurrentGame] = useState();
  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [nextRoundStarting, setNextRoundStarting] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [joinDialogIsOpen, setJoinDialogIsOpen] = useState(false);
  const [notFoundDialogIsOpen, openNotFoundDialog, closeNotFoundDialog] = useDialog();

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
    subscriptions.push(nextRoundStartingSubject.subscribe(setNextRoundStarting));
    return () => subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, []);

  // listen for non existent selected game
  useEffect(() => {
    const subscription = selectedGameExistSubject.subscribe((exist) => {
      if (!exist)
        openNotFoundDialog();
    });
    return () => subscription.unsubscribe();
  }, [openNotFoundDialog]);

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

  const handleCloseJoinDialog = useCallback(() => {
    setJoinDialogIsOpen(false);
    history.replace('/');
  }, [history]);

  const handleCloseNotFoundDialog = useCallback(() => {
    closeNotFoundDialog(false);
    history.replace('/');
  }, [closeNotFoundDialog, history]);

  const handleDeleteGame = useCallback(() => {
    deleteGame(currentGame?.id);
    history.replace('/');
  }, [currentGame, history]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {!currentGame && <OverlayLoader />}

      {currentGame?.playedBlackCard && (
        <Box p={2} display="flex" justifyContent="center">
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
              onPlayerClickCard={playCard}
              onCZarClickCard={pickWinner}
              nextRoundStarting={nextRoundStarting}
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
            onRemovePlayer={removePlayer}
            canRemovePlayer={(player) => currentGame?.ownerID === currentPlayer?.id
              && currentGame?.ownerID !== player.id}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <GameSettings
            onLeaveGame={leaveGame}
            canLeaveGame={currentGame?.ownerID !== currentPlayer?.id}
            onDeleteGame={handleDeleteGame}
            canDeleteGame={currentGame?.ownerID === currentPlayer?.id}
          />
        </TabPanel>
      </Box>

      <AlertDialog
        open={joinDialogIsOpen}
        title="Join this game?"
        cancelText="No, I want my mummy"
        confirmText="Bring it on!"
        onCancel={handleCloseJoinDialog}
        onConfirm={() => joinGame(gameID)}
      >
        {`Join to play ${currentGame?.name ?? ''} Game`}
      </AlertDialog>

      <AlertDialog
        open={notFoundDialogIsOpen}
        title="Game not found"
        confirmText="Close"
        onConfirm={handleCloseNotFoundDialog}
      >
        The game does not exist <SentimentVeryDissatisfied />. It may have been deleted or the link is incorrect.
      </AlertDialog>
    </Box>
  );
});

export default GamePage;

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
import GameJoinDialog from 'components/GameJoinDialog/GameJoinDialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { selectGame } from 'stream/gamesList/gamesList';
import joinGame, { playerJoinedGameSubject } from 'stream/gamesList/joinGame/joinGame';
import pickWinner from 'stream/currentGame/pickWinner/pickWinner';
import playCard from 'stream/currentGame/playCard/playCard';
import nextRound from 'stream/currentGame/nextRound/nextRound';
import {
  playerPlayedCardSubject,
} from 'stream/currentGame/playedCards/playedCards';
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
  }, [gameID]);

  // bind component state to currentGameSubject
  useEffect(() => {
    const subscription = currentGameSubject.subscribe(setcurrentGame);
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
      if (player.id !== currentPlayer?.id)
        enqueueSnackbar(`${player.name} joined game`);
    });
    return () => subscription.unsubscribe();
  }, [currentPlayer, enqueueSnackbar]);

  // listen for player play card event
  useEffect(() => {
    const subscription = playerPlayedCardSubject.subscribe((player) => {
      if (player.id !== currentPlayer?.id)
        enqueueSnackbar(`${player.name} played a card`);
    });
    return () => subscription.unsubscribe();
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

      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Game" />
        <Tab label="Deck" />
        <Tab label="Players" />
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
      </Box>

      <GameJoinDialog
        isOpen={joinDialogIsOpen}
        gameName={currentGame?.name ?? ''}
        onClose={handleCloseJoinDialog}
        onConfirm={handleConfirmJoinDialog}
      />
    </Box>
  );
});

export default GamePage;

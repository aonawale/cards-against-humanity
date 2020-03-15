import React, {
  memo, useState, useEffect, useCallback, useMemo,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card/Card';
import TabPanel from 'components/TabPanel/TabPanel';
import PlayersList from 'components/PlayersList/PlayersList';
import GameDeck from 'components/GameDeck/GameDeck';
import GameJoinDialog from 'components/GameJoinDialog/GameJoinDialog';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { cardTypes } from 'components/CardPaper/CardPaper';
import { selectGame } from 'stream/gamesList/gamesList';
import joinGame, { playerJoinedGameSubject } from 'stream/gamesList/joinGame/joinGame';
import playCard, { playerPlayedCardSubject } from 'stream/currentGame/playCard/playCard';
import { playedWhiteCardsSubject } from 'stream/currentGame/playedCards/playedCards';
import currentGameSubject from 'stream/currentGame/currentGame';
import currentPlayerSubject from 'stream/currentPlayer/currentPlayer';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import { useSnackbar } from 'notistack';

const GamePage = memo(() => {
  const history = useHistory();
  const { gameID } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [currentGame, setcurrentGame] = useState();
  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [playedWhiteCards, setPlayedWhiteCards] = useState();
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

  // bind component state to playedWhiteCardsSubject
  useEffect(() => {
    const subscription = playedWhiteCardsSubject.subscribe(setPlayedWhiteCards);
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

  const handleCardClick = useCallback((card) => {
    playCard(card);
  }, []);

  const currentPlayerIsCzar = useMemo(() => currentPlayer?.id === currentGame?.cZarID, [currentGame, currentPlayer]);

  return (
    <Box p={2}>
      <Grid container spacing={4} justify="center">

        {currentGame?.playedBlackCard && (
          <Grid item>
            <Card
              type={cardTypes.black}
              card={currentGame.playedBlackCard}
            />
          </Grid>
        )}

      </Grid>

      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Game" />
        <Tab label="Players" />
        <Tab label="Deck" />
      </Tabs>

      <TabPanel value={currentTab} index={0}>
        <Box display="flex" width="100%" overflow="scroll">

          {(() => {
            if (currentGame?.state === 'picking_winner') {
              if (currentPlayerIsCzar) {
                return playedWhiteCards?.map((card) => (
                  <Box key={card.text} p={2}>
                    <Card
                      card={card}
                      onClick={handleCardClick}
                      isClickable={currentPlayerIsCzar}
                    />
                  </Box>
                ));
              }
              return (
                <Box p={2} height="100%" width="100%">
                  <Typography variant="h4" component="h1">
                    The CZar is picking a winner
                  </Typography>
                </Box>
              );
            }

            if (currentGame?.state === 'playing_cards') {
              if (currentPlayerIsCzar) {
                return (
                  <Box p={2} height="100%" width="100%">
                    <Typography variant="h4" component="h1">
                      Players are playing cards
                    </Typography>
                  </Box>
                );
              }
              return currentPlayer?.cards.map((card) => (
                <Box key={card.text} p={2}>
                  <Card
                    card={card}
                    isClickable={currentPlayer && currentGame?.canPlayWhiteCard(currentPlayer)}
                    onClick={handleCardClick}
                  />
                </Box>
              ));
            }

            return null;
          })()}
        </Box>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <PlayersList
          players={currentGame?.players}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <GameDeck
          whiteCardsDeck={currentGame?.whiteCardsDeck}
          blackCardsDeck={currentGame?.blackCardsDeck}
        />
      </TabPanel>

      <GameJoinDialog
        isOpen={joinDialogIsOpen}
        gameName={currentGame?.name || ''}
        onClose={handleCloseJoinDialog}
        onConfirm={handleConfirmJoinDialog}
      />
    </Box>
  );
});

export default GamePage;

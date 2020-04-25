import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import startGame, { newGameStartedSubject } from 'stream/gamesList/startGame/startGame';
import deleteGame from 'stream/gamesList/deleteGame/deleteGame';
import gamesListSubject from 'stream/gamesList/gamesList';
import { currentUserSubject } from 'stream/currentUser/currentUser';
import linkAccount, {
  linkAccountStateSubject,
  accountLinkedSubject,
} from 'stream/currentUser/linkAccount/linkAccount';
import { decksListSubject, defaultDeckSubject } from 'stream/decksList/decksList';
import GamesList from 'components/GamesList/GamesList';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import GameStartDialog from 'components/GameStartDialog/GameStartDialog';
import Login from 'components/Login/Login';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useDialog from 'hooks/dialog';
import useObservable from 'hooks/observable';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const history = useHistory();
  const [isStartingGame, setIsStartingGame] = useState(false);
  const decksList = useObservable(decksListSubject, []);
  const defaultDeck = useObservable(defaultDeckSubject);
  const gamesList = useObservable(gamesListSubject, []);
  const currentUser = useObservable(currentUserSubject);
  const linkAccountState = useObservable(linkAccountStateSubject);
  const [startDialogIsOpen, openStartDialog, closeStartDialog] = useDialog();
  const [upgradeAccountDialogIsOpen, openUpgradeAccountDialog, closeUpgradeAccountDialog] = useDialog();

  // listen for account linked event
  useEffect(() => {
    const subscription = accountLinkedSubject.subscribe(() => {
      closeUpgradeAccountDialog();
      openStartDialog();
    });
    return () => subscription.unsubscribe();
  }, [closeUpgradeAccountDialog, openStartDialog]);

  // listen for new game event
  useEffect(() => {
    const subscription = newGameStartedSubject.subscribe((id) => {
      setIsStartingGame(false);
      closeStartDialog();
      history.push(`games/${id}`);
    });
    return () => subscription.unsubscribe();
  }, [closeStartDialog, history]);

  const handleClickGame = useCallback(({ id }) => {
    history.push(`games/${id}`);
  }, [history]);

  const handleDeleteGame = useCallback(({ id }) => {
    deleteGame(id);
  }, []);

  const handleConfirmStartDialog = useCallback(({ name, deck }) => {
    startGame(name, deck);
    setIsStartingGame(true);
  }, []);

  const handleLinkAccountClose = useCallback(() => {
    if (!linkAccountState?.isLoading)
      closeUpgradeAccountDialog();
  }, [closeUpgradeAccountDialog, linkAccountState]);

  const handleAddClick = useCallback(() => {
    if (currentUser?.isAnonymous)
      openUpgradeAccountDialog();
    else
      openStartDialog();
  }, [currentUser, openStartDialog, openUpgradeAccountDialog]);

  return (
    <Container>
      {gamesList.length ? (
        <GamesList
          games={gamesList}
          currentUser={currentUser}
          onClickGame={handleClickGame}
          onDeleteGame={handleDeleteGame}
        />
      ) : null}

      <GameStartDialog
        decks={decksList}
        defaultDeck={defaultDeck}
        isOpen={startDialogIsOpen}
        isStarting={isStartingGame}
        onClose={closeStartDialog}
        onStart={handleConfirmStartDialog}
      />

      <AlertDialog
        open={upgradeAccountDialogIsOpen}
        title="Sign in to create game"
        onBackdropClick={handleLinkAccountClose}
      >
        <Login
          loading={linkAccountState?.isLoading}
          error={linkAccountState?.error}
          onAuth={linkAccount}
        />
      </AlertDialog>

      <Tooltip title="New Game" aria-label="New Game">
        <Zoom in unmountOnExit timeout={transitionDuration} className={classes.fab}>
          <Fab color="primary" aria-label="add" onClick={handleAddClick}>
            <AddIcon />
          </Fab>
        </Zoom>
      </Tooltip>
    </Container>
  );
};

export default HomePage;

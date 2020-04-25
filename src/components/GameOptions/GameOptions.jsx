import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import ShareMenu from 'components/ShareMenu/ShareMenu';
import useDialog from 'hooks/dialog';
import Game from 'game/game';
import Player from 'game/player/player';

const GameOptions = memo(({
  game, currentPlayer, onLeaveGame, onDeleteGame, onSwapCards,
}) => {
  const [leaveDialogIsOpen, openLeaveDialog, closeLeaveDialog] = useDialog();
  const [deleteDialogIsOpen, openDeleteDialog, closeDeleteDialog] = useDialog();
  const [shareDialogIsOpen, openShareDialog, closeShareDialog] = useDialog();
  const [swapCardsDialogIsOpen, openSwapCardsDialog, closeSwapCardsDialog] = useDialog();

  const handleConfirmLeaveDialog = useCallback(() => {
    closeLeaveDialog(false);
    onLeaveGame();
  }, [closeLeaveDialog, onLeaveGame]);

  const handleConfirmDeleteDialog = useCallback(() => {
    closeDeleteDialog(false);
    onDeleteGame();
  }, [closeDeleteDialog, onDeleteGame]);

  const handleConfirmSwapCardsDialog = useCallback(() => {
    closeSwapCardsDialog(false);
    onSwapCards();
  }, [closeSwapCardsDialog, onSwapCards]);

  return (
    <Container maxWidth="sm">
      <List>
        <ListItem button onClick={openShareDialog}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText primary="Share" />
        </ListItem>
        {(game.canSwapCards(currentPlayer)) && (
          <ListItem button onClick={openSwapCardsDialog}>
            <ListItemIcon>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="Swap cards"
              secondary={`Used ${currentPlayer.cardsSwapCount} out of ${Game.maxCardsSwapCount}`}
            />
          </ListItem>
        )}
        {(game.ownerID !== currentPlayer.id) && (
          <ListItem button onClick={openLeaveDialog}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Leave game" />
          </ListItem>
        )}
        {(game.ownerID === currentPlayer.id) && (
          <ListItem button onClick={openDeleteDialog}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete game" />
          </ListItem>
        )}
      </List>

      <AlertDialog
        open={leaveDialogIsOpen}
        title="Leave this game?"
        onCancel={closeLeaveDialog}
        onConfirm={handleConfirmLeaveDialog}
        onBackdropClick={closeLeaveDialog}
        textContent="Your current game data will be lost. You can still join the game again."
      />

      <AlertDialog
        open={deleteDialogIsOpen}
        title="Delete this game?"
        confirmText="Delete"
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDeleteDialog}
        onBackdropClick={closeDeleteDialog}
        textContent="All game data will be permanently deleted."
      />

      <AlertDialog
        open={swapCardsDialogIsOpen}
        title="Swap current cards?"
        onCancel={closeSwapCardsDialog}
        onConfirm={handleConfirmSwapCardsDialog}
        onBackdropClick={closeSwapCardsDialog}
        textContent="Your current set of cards will be replaced with new cards."
      />

      <AlertDialog
        title="Share Game"
        open={shareDialogIsOpen}
        onBackdropClick={closeShareDialog}
      >
        <ShareMenu
          Component={List}
          itemComponent={ListItem}
          onClickItem={closeShareDialog}
        />
      </AlertDialog>
    </Container>
  );
});

GameOptions.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  currentPlayer: PropTypes.instanceOf(Player).isRequired,
  onLeaveGame: PropTypes.func.isRequired,
  onDeleteGame: PropTypes.func.isRequired,
  onSwapCards: PropTypes.func.isRequired,
};

export default GameOptions;

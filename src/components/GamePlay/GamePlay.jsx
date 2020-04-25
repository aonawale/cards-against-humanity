import React, {
  memo, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import shuffle from 'lib/shuffle';
import Game, { gameStates } from 'game/game';
import Player from 'game/player/player';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Card from 'components/Card/Card';
import Info from 'components/GamePlay/Info/Info';
import ShareMenu from 'components/ShareMenu/ShareMenu';
import CardsStack from 'components/CardsStack/CardsStack';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const useStyles = makeStyles({
  card: {
    marginRight: '16px',
    display: 'inline-block',
    verticalAlign: 'top',
    '&:last-of-type': {
      marginRight: '0px',
    },
  },
});

const normalize = (value) => (value - 0) * (100 / (Game.countDownTime - 0));
const pluralize = (word, count) => (count > 1 ? `${word}s` : word);

const GamePlay = memo(({
  game, currentPlayer, onCZarClickCard, onPlayerClickCard, nextRoundStarting,
}) => {
  const classes = useStyles();
  const currentPlayerIsCzar = currentPlayer.id === game.cZarID;

  const hasRequiredPlayers = game.players.length > 1;
  const czarName = game.getPlayer(game.cZarID)?.firstName;

  const formatPlayerNames = useCallback((names) => {
    const formattedNames = names.length > 1
      ? [...names.slice(0, names.length - 2), names.slice(-2).join(' and ')]
      : names;
    return formattedNames.join(', ');
  }, []);

  const playerNames = useMemo(
    () => formatPlayerNames(game.pendingPlayers
      .filter(({ id }) => id !== game.cZarID)
      .map(({ firstName }) => firstName)),
    [formatPlayerNames, game.cZarID, game.pendingPlayers],
  );

  const otherPlayerNames = useMemo(
    () => formatPlayerNames(game.pendingPlayers
      .filter(({ id }) => id !== currentPlayer.id)
      .map(({ firstName }) => firstName)),
    [currentPlayer.id, formatPlayerNames, game.pendingPlayers],
  );

  const shuffledPlayedWhiteCards = useMemo(
    () => shuffle([...game.playedWhiteCards.values()]),
    [game.playedWhiteCards],
  );

  switch (game.state) {
    case gameStates.playingCards:
      return currentPlayerIsCzar
        ? (
          <Info
            title={hasRequiredPlayers ? `Waiting for ${playerNames} to play...` : 'Waiting for players to join...'}
          >
            {!hasRequiredPlayers && (
              <PopupState variant="popover" popupId="share-menu">
                {(popupState) => (
                  <>
                    <Tooltip title="Share Game" aria-label="Share Game">
                      <IconButton
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...bindTrigger(popupState)}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <ShareMenu
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...bindMenu(popupState)}
                      onClickItem={popupState.close}
                      Component={Menu}
                      itemComponent={MenuItem}
                    />
                  </>
                )}
              </PopupState>
            )}
          </Info>
        )
        : (
          <Info
            title={game.hasPlayedWhiteCards(currentPlayer)
              ? `Waiting for ${otherPlayerNames} to play...`
              : 'Click card to play.'}
            subtitle={!game.hasPlayedWhiteCards(currentPlayer)
              ? `Requires ${game.playedBlackCard?.pick} 
                ${pluralize('card', game.playedBlackCard?.pick)}. ${czarName} is the Czar.`
              : null}
          >
            {currentPlayer.cards.map((card) => (
              <Card
                key={card.text}
                card={card}
                classes={classes.card}
                isClickable={game.canPlayWhiteCard(currentPlayer, card)}
                onClick={onPlayerClickCard}
              />
            ))}
          </Info>
        );
    case gameStates.pickingWinner:
      return currentPlayerIsCzar
        ? (
          <Info title="Players played cards." subtitle="Click card to choose a winner.">
            {shuffledPlayedWhiteCards.map((cards) => (
              <CardsStack
                key={cards.map(({ text }) => text).join('')}
                className={classes.card}
                cards={cards}
                onClick={onCZarClickCard}
              />
            ))}
          </Info>
        )
        : <Info title={`Waiting for ${czarName} to choose a winner.`} />;
    case gameStates.winnerSelected:
      return currentPlayerIsCzar
        ? (
          <Info
            title={`You choose ${game.roundWinner.firstName} as the winner.`}
            subtitle={game.canPlayNextRound ? 'Next round starting in...' : null}
          >
            {game.canPlayNextRound ? (
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Box position="absolute" zIndex={1}>{nextRoundStarting}</Box>
                <CircularProgress variant="static" value={normalize(nextRoundStarting)}>
                  {nextRoundStarting}
                </CircularProgress>
              </Box>
            ) : (
              <Typography>
                  The End
              </Typography>
            )}
          </Info>
        )
        : (
          <Info title={`${czarName} choose 
            ${game.roundWinnerID === currentPlayer.id ? 'your' : `${game.roundWinner.firstName}'s`} card`}
          >
            {game.roundWinnerCards.map((card) => (
              <Card key={card.text} card={card} classes={classes.card} />
            ))}
          </Info>
        );
    default:
      return null;
  }
});

GamePlay.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  currentPlayer: PropTypes.instanceOf(Player).isRequired,
  onPlayerClickCard: PropTypes.func.isRequired,
  onCZarClickCard: PropTypes.func.isRequired,
  nextRoundStarting: PropTypes.number,
};

export default GamePlay;

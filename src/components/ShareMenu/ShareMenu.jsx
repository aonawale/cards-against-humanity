import React, {
  memo, useCallback, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import Menu from '@material-ui/core/Menu';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import ShareMenuItem from 'components/ShareMenu/Item/Item';

const ShareMenu = memo(forwardRef(({
  onClickItem, Component, itemComponent, ...rest
}, ref) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Link copied to clipboard');
    if (onClickItem)
      onClickItem();
  }, [enqueueSnackbar, onClickItem]);

  const openLink = useCallback((url) => {
    window.open(url, '_blank');
    onClickItem();
  }, [onClickItem]);

  const handleFacebook = useCallback(() => {
    openLink(`https://www.facebook.com/sharer.php?u=${encodeURI(window.location.href)}`);
  }, [openLink]);

  const handleTwitter = useCallback(() => {
    openLink(
      `https://twitter.com/intent/tweet?text=Play Cards Against Humanity with me ${encodeURI(window.location.href)}`,
    );
  }, [openLink]);

  return (
    <Component
      id="share-menu"
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <CopyToClipboard
        text={window.location.href}
        onCopy={handleCopy}
      >
        <ShareMenuItem Component={itemComponent} text="Copy link" icon={<FileCopyIcon />} onClick={onClickItem} />
      </CopyToClipboard>
      <ShareMenuItem Component={itemComponent} text="Facebook" icon={<FacebookIcon />} onClick={handleFacebook} />
      <ShareMenuItem Component={itemComponent} text="Twitter" icon={<TwitterIcon />} onClick={handleTwitter} />
    </Component>
  );
}));

ShareMenu.muiName = Menu.muiName;

ShareMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  Component: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itemComponent: PropTypes.object.isRequired,
  onClickItem: PropTypes.func,
};

export default ShareMenu;

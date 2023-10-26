import React from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreIcon from '@mui/icons-material/MoreVert';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  bottom: -20,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export default function Header({
  addNewTab,
  numberOfSavedTabs,
  clearAllTabs,
  refreshTabList,
  openSettingsModal,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearSavedTabs = () => {
    const result = confirm(
      'Are you sure you want to clear your saved tab list?\n\nThis action cannot be undone.'
    );
    if (result == true) {
      clearAllTabs();
    }
    handleClose();
  };

  const handleInfoClick = () => {
    alert(`Version 1.0.4\n\nDeveloped by Hristiyan Maverov.`);
    handleClose();
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{ backgroundColor: '#303030', bottom: 'auto', top: 0 }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="extension title">
            <Tooltip
              title={`${numberOfSavedTabs} saved tabs`}
              placement="right"
            >
              <Badge badgeContent={numberOfSavedTabs} color="success">
                <BookmarkIcon />
              </Badge>
            </Tooltip>
          </IconButton>
          <Tooltip title="Add Tab" placement="right" followCursor>
            <StyledFab aria-label="add" onClick={addNewTab}>
              <AddIcon />
            </StyledFab>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={refreshTabList} color="inherit">
            <Tooltip title="Refresh">
              <RefreshIcon />
            </Tooltip>
          </IconButton>
          <IconButton color="inherit">
            <Tooltip title="Settings">
              <SettingsIcon onClick={openSettingsModal} />
            </Tooltip>
          </IconButton>
          <IconButton
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Tooltip title="Menu">
              <MoreIcon />
            </Tooltip>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClearSavedTabs}>Clear List</MenuItem>
            <MenuItem onClick={handleInfoClick}>About</MenuItem>
            <MenuItem onClick={handleClose}>Close</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}

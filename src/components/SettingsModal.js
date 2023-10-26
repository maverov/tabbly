import React, { memo } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SettingsModal = ({
  openModal,
  closeModal,
  handleFileImport,
  savedTabs,
}) => {
  const exportTabsToJSON = () => {
    const jsonContent = JSON.stringify(savedTabs, null, 2);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Tabbly_Export_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div id="settings-modal">
      <Dialog
        fullScreen
        open={openModal}
        onClose={closeModal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#303030' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={closeModal}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        {/* <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List> */}
        <Typography
          sx={{ fontSize: '16px', marginLeft: '0.5rem', marginTop: '2rem' }}
          variant="h6"
          component="div"
        >
          Warning: Importing tabs will replace your current list!
        </Typography>
        <div style={{ margin: '1rem', display: 'flex', gap: '0.5rem' }}>
          <label htmlFor="file-input">
            <Button variant="contained" color="success" component="span">
              Import
            </Button>
          </label>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileImport}
          />
          <Button
            variant="contained"
            color="success"
            onClick={exportTabsToJSON}
          >
            Export
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default memo(SettingsModal);

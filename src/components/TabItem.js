import React, { memo, useState, useCallback } from 'react';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import {
  extractDomainFromURL,
  validateFaviconURL,
  truncateTabTitle,
} from '../utils';

import './TabItem.css';

const TabItem = ({ tab, deleteTab, renameTab }) => {
  const [currentTabtitle, setCurrentTabTitle] = useState(tab.title);
  const [editActive, setEditActive] = useState(false);

  const handleTabClick = useCallback(() => {
    chrome.tabs.create({ url: tab.url, active: false });
  }, []);

  const handleTitleChange = useCallback((e) => {
    setCurrentTabTitle(e.target.value);
  }, []);

  const handleCompleteTitleChange = () => {
    setEditActive(!editActive);
    renameTab(tab, currentTabtitle);
  };

  return (
    <div className="tab-details-container">
      <div
        className="tab-details-container__left"
        onClick={editActive ? false : handleTabClick}
      >
        <div className="favicon">
          {validateFaviconURL(tab.faviconUrl) ? (
            <img
              src={tab.faviconUrl}
              width={26}
              height={26}
              loading="lazy"
              alt="Dynamic Image"
            />
          ) : (
            <BookmarkIcon sx={{ color: '#eee', width: 26, height: 26 }} />
          )}
        </div>
        <div>
          {editActive ? (
            <div>
              <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                value={currentTabtitle}
                onChange={handleTitleChange}
                sx={{
                  width: '320px',
                  backgroundColor: 'darkgrey',
                  transition: 'all 0.5s ease-out',
                }}
                size="small"
              />
            </div>
          ) : (
            <p className="tab-title">{truncateTabTitle(tab.title)}</p>
          )}
          <span className="tab-domain">{extractDomainFromURL(tab.url)}</span>
        </div>
      </div>
      <div className="tab-details-container__right">
        <IconButton>
          <Tooltip title={editActive ? 'Done' : 'Edit'} followCursor>
            {editActive ? (
              <CheckIcon
                onClick={handleCompleteTitleChange}
                sx={{ color: '#9afc8f' }}
              />
            ) : (
              <EditIcon
                onClick={() => setEditActive(!editActive)}
                className="remove-btn"
              />
            )}
          </Tooltip>
        </IconButton>
        <IconButton>
          <Tooltip title="Remove Tab" followCursor>
            <ClearIcon onClick={() => deleteTab(tab)} className="remove-btn" />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default memo(TabItem);

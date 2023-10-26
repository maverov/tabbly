import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import TabItem from '../components/TabItem';
import SettingsModal from '../components/SettingsModal';

import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import './Popup.css';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  useEffect(() => {
    updateTabData();
    chrome.action.setBadgeBackgroundColor({ color: '#9afc8f' }, () => {
      return;
    });
  }, []);

  const updateTabData = () => {
    chrome.storage.local.get(['tabs']).then((result) => {
      if (result.tabs) {
        setTabs(result.tabs);
        chrome.action.setBadgeText(
          {
            text: `${result.tabs.length}`,
          },
          () => ''
        );
      }
    });
  };

  const handleClearTabs = () => {
    chrome.storage.local.set({ tabs: [] }).then(() => {
      return;
    });
    updateTabData();
  };

  const handleDeleteTab = (passedTab) => {
    const updatedTabsArray = tabs.filter((tab) => tab.url !== passedTab.url);
    chrome.storage.local.set({ tabs: updatedTabsArray }).then(() => {
      return;
    });
    setTabs(updatedTabsArray);
    updateTabData();
  };

  const handleTabClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      let newTab = {};
      newTab.id = activeTabs[0].id;
      newTab.faviconUrl = activeTabs[0].favIconUrl;
      newTab.title = activeTabs[0].title;
      newTab.url = activeTabs[0].url;

      if (!tabs.find((element) => element.url === newTab.url)) {
        const updatedTabsArray = [newTab, ...tabs];
        chrome.storage.local.set({ tabs: updatedTabsArray }).then((result) => {
          setTabs(result.tabs);
        });

        updateTabData();
      }
    });
  };

  const handleTabRename = (editedTab, newName) => {
    if (newName !== editedTab.title) {
      const updatedTab = editedTab;
      const updatedTabsArray = [...tabs];
      updatedTab.title = newName;

      const indexOfEditedTab = updatedTabsArray.findIndex(
        (tab) => tab.url === editedTab.url
      );
      updatedTabsArray[indexOfEditedTab] = updatedTab;

      chrome.storage.local.set({ tabs: updatedTabsArray }).then((result) => {
        setTabs(result.tabs);
        updateTabData();
      });
    }
  };

  const handleFileImportClick = (e) => {
    const file = e.target.files[0];
    const allowedFormats = ['application/json'];

    if (file) {
      if (allowedFormats.includes(file.type)) {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const parsedData = JSON.parse(event.target.result);
            console.log('File imported successfully:', parsedData);

            chrome.storage.local.set({ tabs: parsedData }).then((result) => {
              setTabs(result.tabs);
            });
          } catch (error) {
            alert('Error parsing JSON:', error);
            console.log('Error parsing JSON:', error);
          }
        };

        reader.readAsText(file);
        setTimeout(() => {
          updateTabData();
          setOpenSettingsModal(false);
        }, 2000);
      } else {
        alert('Invalid file format. Please select a JSON file.');
      }
    }
  };

  const handleUpdateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenSettingsModal = () => {
    setOpenSettingsModal(true);
  };

  const handleCloseSettingsModal = () => {
    setOpenSettingsModal(false);
  };

  return (
    <div className="main-container">
      <Header
        addNewTab={handleTabClick}
        numberOfSavedTabs={tabs.length}
        clearAllTabs={handleClearTabs}
        refreshTabList={updateTabData}
        openSettingsModal={handleOpenSettingsModal}
      />

      <Box
        sx={{
          width: '100%',
          marginTop: '2rem',
        }}
      >
        <input
          type="text"
          onChange={handleUpdateSearchTerm}
          className="search-bar"
          placeholder="Search tabs..."
        />
      </Box>

      {searchTerm === '' ? (
        <Box sx={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          <TransitionGroup>
            {tabs.map((tab) => {
              return (
                <Collapse key={tab.url}>
                  <TabItem
                    tab={tab}
                    deleteTab={handleDeleteTab}
                    renameTab={handleTabRename}
                  />
                </Collapse>
              );
            })}
          </TransitionGroup>
        </Box>
      ) : (
        <Box sx={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          {tabs
            .filter((tab) => {
              return tab.title.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((filteredTab) => {
              return (
                <TabItem
                  key={filteredTab.url}
                  tab={filteredTab}
                  deleteTab={handleDeleteTab}
                  renameTab={handleTabRename}
                />
              );
            })}
        </Box>
      )}

      <SettingsModal
        openModal={openSettingsModal}
        closeModal={handleCloseSettingsModal}
        handleFileImport={handleFileImportClick}
        savedTabs={tabs}
      />
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));

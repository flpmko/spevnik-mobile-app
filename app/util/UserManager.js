import React, { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import { getStoredObjectData, removeData } from './LocalStorage';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [fontSize, setFontSize] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');

  const resetFontSize = () => {
    setFontSize(20);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const initSeasons = async () => {
    const seaons = await getStoredObjectData('seasons');
    setSeasons(seaons);
  };

  const initFavs = async () => {
    const favs = await getStoredObjectData('favorites');
    setFavorites(favs);
  };

  const resetFavs = async () => {
    const favs = await removeData('favorites');
    setFavorites([]);
  };

  const initPlays = async () => {
    const plays = await getStoredObjectData('playlists');
    setPlaylists(plays);
  };

  const resetPlays = async () => {
    const plays = await removeData('playlists');
    setPlaylists([]);
  };

  useEffect(() => {
    initFavs();
    initPlays();
    initSeasons();
  }, []);

  return (
    <UserContext.Provider
      value={{
        theme,
        fontSize,
        favorites,
        playlists,
        seasons,
        activeFilter,
        toggleTheme,
        resetFontSize,
        setFontSize,
        setFavorites,
        setPlaylists,
        setSeasons,
        setActiveFilter,
        resetFavs,
        resetPlays,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

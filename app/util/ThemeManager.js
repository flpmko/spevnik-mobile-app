import React, { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import { getStoredObjectData, removeData } from './LocalStorage';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [fontSize, setFontSize] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);

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
    const favs = await removeData('playlists');
    setPlaylists([]);
  };

  useEffect(() => {
    initFavs();
    initPlays();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        fontSize,
        favorites,
        playlists,
        toggleTheme,
        resetFontSize,
        setFontSize,
        setFavorites,
        setPlaylists,
        resetFavs,
        resetPlays,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

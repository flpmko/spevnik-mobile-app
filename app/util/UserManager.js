import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";

import { getStoredObjectData, removeData } from "./LocalStorage";

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [fontSize, setFontSize] = useState(20);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");

  const resetFontSize = () => {
    setFontSize(20);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const initSeasons = async () => {
    const sns = await getStoredObjectData("seasons");
    setSeasons(sns);
  };

  const initFavs = async () => {
    await getStoredObjectData("favorites").then((favs) =>
      setFavorites(favs ? favs : [])
    );
  };

  const resetFavs = async () => {
    await removeData("favorites");
    setFavorites([]);
  };

  const initPlays = async () => {
    await getStoredObjectData("playlists").then((plays) =>
      setPlaylists(plays ? plays : [])
    );
  };

  const resetPlays = async () => {
    await removeData("playlists");
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

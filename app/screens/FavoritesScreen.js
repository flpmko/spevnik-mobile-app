import React from "react";
import SongsPage from "../components/song/SongsPage";
import favorites_data from "../data/favorites_data";

const FavoritesScreen = () => {
  return (
    <SongsPage screenTitle={"Obľúbené"} data={favorites_data} filters={false} />
  );
};

export default FavoritesScreen;

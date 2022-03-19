import React from "react";
import SongsPage from "../components/song/SongsPage";
import songs_data from "../data/songs_data";

const SongsScreen = (props) => {
  return <SongsPage data={songs_data} screenTitle={"Piesne"} filters={true} />;
};

export default SongsScreen;

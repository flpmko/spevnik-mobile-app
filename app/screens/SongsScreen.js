import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase-config";
import SongsPage from "../components/song/SongsPage";
import songs_data from "../data/songs_data";

const SongsScreen = () => {
  const [hymnsData, setHymnsData] = useState();
  // const hymnsRef = doc(db, "index/hymns");

  // const fetchSongs = async () => {
  //   const data = await getDoc(hymnsRef);
  //   setHymnsData(data);
  // };

  // useEffect(() => {
  //   fetchSongs();
  // }, []);

  return <SongsPage data={hymnsData} screenTitle={"Piesne"} filters={true} />;
};

export default SongsScreen;

import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { filter } from "lodash";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../firebase-config";
import { ThemeContext } from "../../util/ThemeManager";
import ListItem from "../list/ListItem";
import Separator from "../list/Separator";
import SearchBar from "../SearchBar";
import SearchFilterBar from "../SearchFilterBar";

import colors from "../../config/colors";

const SongsList = ({ route, navigation }) => {
  // const allSongs = props.route.params.data;
  const { theme } = React.useContext(ThemeContext);
  const [allSongs, setAllSongs] = useState();
  const [hymnsData, setHymnsData] = useState();
  const [songs, setSongs] = useState(allSongs);
  const [seasonQuery, setSeasonQuery] = useState("");
  const [query, setQuery] = useState("");
  const hymnsRef = doc(db, "index/hymns");
  const filters = [
    "Advent",
    "Vianoce",
    "Veľká noc",
    "Pôst",
    "Vstúpenie",
    "Zoslanie",
    "Trojjediný",
    "Cirkev",
  ];

  const fetchSongs = async () => {
    const data = await getDoc(hymnsRef);
    setHymnsData(data);
    let songsData = data.get("all");
    setAllSongs(songsData);
    setSongs(songsData);
  };

  // search helper function
  const contains = ({ number }, input) => {
    if (number.toString().startsWith(input)) {
      return true;
    }
    return false;
  };

  // search the list of hymns based on number
  const handleSearch = (input) => {
    let dataSet;
    // if (seasonQuery) {
    //   dataSet = songs;
    // } else {
    //   dataSet = allSongs;
    // }
    dataSet = allSongs;
    const data = filter(dataSet, (song) => {
      return contains(song, input);
    });
    setSongs(data);
    setQuery(input);
  };

  // filer the list of hymns based on season
  const handleFilter = () => {
    if (seasonQuery === "") {
      setSongs(hymnsData.get("all"));
    } else {
      setSongs(
        allSongs.filter(function (el) {
          return el.season == seasonQuery;
        })
      );
    }
  };

  const goToSong = async (item) => {
    const songRef = doc(db, `hymns/${item.number}`);
    const song = await getDoc(songRef);
    navigation.push("SongDetail", { song: song.data() });
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return <ListItem item={item} onPress={() => goToSong(item)} />;
        }}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          route.params.filters ? (
            <SearchFilterBar
              filters={filters}
              handleFilter={handleFilter}
              query={query}
              handleSearch={handleSearch}
              seasonQuery={seasonQuery}
              setSeasonQuery={setSeasonQuery}
            />
          ) : (
            <SearchBar handleSearch={handleSearch} query={query} />
          )
        }
      />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  containerSearch: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  textInput: {
    backgroundColor: colors.lightgray,
    padding: 10,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    width: "98%",
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

export default SongsList;

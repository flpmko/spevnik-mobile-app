import React, { useState } from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { filter } from "lodash";

import { ThemeContext } from "../../util/ThemeManager";
import ListItem from "../list/ListItem";
import Separator from "../list/Separator";
import SearchBar from "../SearchBar";
import SearchFilterBar from "../SearchFilterBar";
import colors from "../../config/colors";

const SongsList = (props) => {
  const filters = ["Vianoce", "Veľká noc", "Pôst", "Slávnostné"];
  const allSongs = props.route.params.data;
  const { theme } = React.useContext(ThemeContext);
  const [songs, setSongs] = useState(allSongs);
  const [query, setQuery] = useState("");

  const contains = ({ number }, input) => {
    if (number.toString().includes(input)) {
      return true;
    }
    return false;
  };

  const handleSearch = (input) => {
    const data = filter(allSongs, (song) => {
      return contains(song, input);
    });
    setSongs(data);
    setQuery(input);
  };

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return (
            <ListItem
              item={item}
              onPress={() =>
                props.navigation.push("SongDetail", { song: item })
              }
            />
          );
        }}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          props.route.params.filters ? (
            <SearchFilterBar
              filters={filters}
              handleSearch={handleSearch}
              query={query}
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

import React from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ThemeContext } from "../../util/ThemeManager";
import PlaylistItem from "./PlaylistItem";
import colors from "../../config/colors";

const PlaylistList = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const Playlists = props.route.params.playlists;

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={Playlists}
        contentOffset={{ x: 0, y: -10 }}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return (
            <PlaylistItem
              item={item}
              onPress={() =>
                props.navigation.push("PlaylistDetail", { playlist: item })
              }
            />
          );
        }}
      />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

export default PlaylistList;

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
});

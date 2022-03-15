import React from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ThemeContext } from "../util/ThemeManager";
import Separator from "../components/Separator";
import colors from "../config/colors";
import PlaylistListItem from "../components/PlaylistListItem";

const PlaylistDetail = ({ navigation, route }) => {
  const { theme } = React.useContext(ThemeContext);
  const songs = route.params.playlist.songs;
  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        style={styles.containerList}
        data={songs}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return (
            <PlaylistListItem
              item={item}
              onPress={() => navigation.push("SongDetail", { song: item })}
            />
          );
        }}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
      />
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerList: {
    height: "100%",
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
});

export default PlaylistDetail;

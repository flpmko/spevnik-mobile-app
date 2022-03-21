import React from "react";
import { StyleSheet, SafeAreaView, FlatList, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ThemeContext } from "../../util/ThemeManager";
import PlaylistItem from "./PlaylistItem";
import colors from "../../config/colors";

const PlaylistList = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const Playlists = props.route.params.playlists;

  const onDeleteItem = () =>
    Alert.alert("Vymazať", "Naozaj chcete tento playlist vymazať?", [
      {
        text: "Zrušiť",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Odstrániť",
        onPress: () => console.log("Delete Pressed"),
        style: "destructive",
      },
    ]);

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={Playlists}
        contentOffset={{ x: 0, y: -10 }}
        keyExtractor={(item) => item.number.toString()}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <PlaylistItem
              item={item}
              onPressItem={() =>
                props.navigation.push("PlaylistDetail", { playlist: item })
              }
              onPressIcon={onDeleteItem}
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

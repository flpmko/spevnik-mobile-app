import React from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ThemeContext } from "../util/ThemeManager";
import ListItem from "../components/ListItem";
import Separator from "../components/Separator";
import colors from "../config/colors";
import songs_data from "../data/songs_data";

const SongsList = ({ navigation }) => {
  const { theme } = React.useContext(ThemeContext);
  const Songs = songs_data;
  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={Songs}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return (
            <ListItem
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
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
});

export default SongsList;

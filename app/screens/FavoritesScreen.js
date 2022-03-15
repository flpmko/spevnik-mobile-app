import { StyleSheet, Text, SafeAreaView } from "react-native";
import React from "react";

import { ThemeContext } from "../util/ThemeManager";
import colors from "../config/colors";

const FavoritesScreen = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <Text style={[styles[`text${theme}`]]}>FavoritesScreen</Text>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

import React from "react";
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from "react-native";

import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";

const SongDetail = ({ route }) => {
  const { theme, fontSize } = React.useContext(ThemeContext);

  const textStyles = StyleSheet.create({
    textText: {
      fontSize: fontSize,
    },
  });

  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, styles[`container${theme}`]]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText]}>{route.params.song.title}</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, styles[`text${theme}`]]}>
            {route.params.song.category},
          </Text>
          <Text style={[styles.categoryText, styles[`text${theme}`]]}>
            {" "}
            {route.params.song.season}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[textStyles.textText, styles[`text${theme}`]]}>
            {route.params.song.text}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongDetail;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    height: "100%",
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
  titleContainer: {
    display: "flex",
  },
  titleText: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primary,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
  },
  categoryText: {
    fontStyle: "italic",
  },
  textContainer: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 100,
  },
});

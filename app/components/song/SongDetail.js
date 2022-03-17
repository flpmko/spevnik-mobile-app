import { StyleSheet, Text, SafeAreaView, ScrollView, View } from "react-native";
import React from "react";
import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";

const SongDetail = ({ route }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <SafeAreaView>
      <ScrollView style={[styles.container, styles[`container${theme}`]]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText]}>{route.params.song.title}</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, styles[`text${theme}`]]}>
            {route.params.song.category}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.textText, styles[`text${theme}`]]}>
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
  },
  categoryText: {
    fontStyle: "italic",
  },
  textContainer: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 100,
  },
  textText: {
    fontSize: 20,
  },
});

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { ThemeContext } from "../util/ThemeManager";
import colors from "../config/colors";

const PlaylistItem = ({ item, onPress }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.listItem, styles[`text${theme}`]]}>
        <View style={styles.containerName}>
          <Text
            style={[styles.listItemName, styles[`text${theme}`]]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
        <View style={styles.containerIcon}>
          <Ionicons
            name={"chevron-forward"}
            size={24}
            color={theme === "light" ? "black" : "white"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaylistItem;

const styles = StyleSheet.create({
  containerIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 10,
  },
  containerName: {
    flex: 5,
    justifyContent: "center",
  },
  listItem: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.primary,
  },
  listItemName: {
    fontSize: 18,
    paddingLeft: 10,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.light,
  },
});

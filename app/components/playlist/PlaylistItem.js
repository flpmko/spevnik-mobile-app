import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";

const PlaylistItem = ({ item, onPressItem, onPressIcon }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <View style={[styles.container, styles[`text${theme}`]]}>
      <TouchableOpacity onPress={onPressItem} style={styles.containerName}>
        <Text
          style={[styles.listItemName, styles[`text${theme}`]]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.containerIcon} onPress={onPressIcon}>
        <Ionicons name={"ios-remove-circle"} size={24} color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default PlaylistItem;

const styles = StyleSheet.create({
  containerIcon: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 5,
    paddingRight: 5,
  },
  containerName: {
    flex: 6,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    margin: 5,
    height: 80,
    borderRadius: 15,
    borderWidth: 0,
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

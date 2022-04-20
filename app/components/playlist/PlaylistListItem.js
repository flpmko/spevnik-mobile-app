import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { UserContext } from "../../util/UserManager";
import colors from "../../config/colors";

const PlaylistListItem = ({ onPress, item }) => {
  const { theme } = React.useContext(UserContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItem}>
        <View style={styles.containerLeftIcon}>
          <Ionicons
            name={"menu"}
            color={theme === "light" ? "black" : "white"}
          />
        </View>
        {item.number ? (
          <View style={styles.containerNumber}>
            <Text style={[styles.listItemNumber, styles[`text${theme}`]]}>
              {item.number}
            </Text>
          </View>
        ) : (
          <View style={styles.containerNumber}>
            <Ionicons
              style={[styles.listItemNumber]}
              name={"musical-note"}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
        )}

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
            color={theme === "light" ? "black" : "white"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaylistListItem;

const styles = StyleSheet.create({
  containerLeftIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  containerName: {
    flex: 6,
    justifyContent: "center",
  },
  containerNumber: {
    flex: 1,
    paddingHorizontal: 3,
  },
  listItem: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: "row",
  },
  listItemNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItemName: {
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

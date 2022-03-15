import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemeContext } from "../util/ThemeManager";

const Separator = () => {
  const { theme } = React.useContext(ThemeContext);
  return <View style={[styles[`separator${theme}`]]} />;
};

export default Separator;

const styles = StyleSheet.create({
  separatorlight: {
    backgroundColor: "lightgray",
    height: 1,
  },
  separatordark: {
    backgroundColor: "#303030",
    height: 1,
  },
});

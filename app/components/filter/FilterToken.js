import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";

const FilterToken = ({ label }) => {
  const { theme } = React.useContext(ThemeContext);
  const [selected, setSelected] = useState(false);

  const handleTouch = () => {
    setSelected(!selected);
  };

  const styles = StyleSheet.create({
    containerTop: {
      paddingRight: 5,
    },
    containerToken: {
      display: "flex",
      borderColor: colors.primary,
      borderWidth: 2,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: selected ? colors.primary : colors.light,
    },
    textToken: {
      fontSize: 16,
      paddingHorizontal: 15,
      paddingVertical: 5,
      fontWeight: "bold",
      textAlign: "center",
      color: selected ? colors.light : colors.dark,
    },
    textdark: {
      //   color: colors.light,
    },
    textlight: {
      //   color: colors.dark,
    },
  });

  return (
    <View style={styles.containerTop}>
      <TouchableOpacity onPress={handleTouch}>
        <View style={styles.containerToken}>
          <Text style={[styles.textToken, styles[`text${theme}`]]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FilterToken;

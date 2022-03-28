import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";

const FilterToken = ({ label, seasonQuery, handleFilter, setSeasonQuery }) => {
  const { theme } = React.useContext(ThemeContext);
  const [selected, setSelected] = useState(false);

  const handleTouch = () => {
    if (!selected) {
      setSeasonQuery("");
    } else {
      setSeasonQuery(label);
    }
    handleFilter();
    setSelected(!selected);
    console.log("seasonQuery", seasonQuery);
    console.log("selected", selected);
  };

  const selectedStyles = StyleSheet.create({
    containerTokenSelected: {
      backgroundColor: selected ? colors.primary : colors.light,
    },
    textTokenSelected: {
      color: selected ? colors.light : colors.dark,
    },
  });

  return (
    <View style={styles.containerTop}>
      <TouchableOpacity onPress={handleTouch}>
        <View
          style={[styles.containerToken, selectedStyles.containerTokenSelected]}
        >
          <Text
            style={[
              styles.textToken,
              selectedStyles.textTokenSelected,
              styles[`text${theme}`],
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FilterToken;

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
  },
  textToken: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  textdark: {
    //   color: colors.light,
  },
  textlight: {
    //   color: colors.dark,
  },
});

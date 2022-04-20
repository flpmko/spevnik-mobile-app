import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

import FilterToken from "./FilterToken";

const FilterBar = ({ data, handleFilter }) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.containerView}
      showsHorizontalScrollIndicator={true}
      scrollIndicatorInsets={{ top: 0, left: 0, bottom: -3, right: 0 }}
    >
      {data?.map((filter) => (
        <FilterToken handleFilter={handleFilter} label={filter} key={filter} />
      ))}
      <View style={styles.containerBlank}></View>
      {/* <LinearGradient
        // Background Linear Gradient
        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.background}
      /> */}
    </ScrollView>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  containerView: {
    width: "100%",
    display: "flex",
    paddingLeft: 10,
  },
  containerBlank: {
    width: 20,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 35,
  },
});

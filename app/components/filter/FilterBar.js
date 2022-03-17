import { StyleSheet, ScrollView } from "react-native";
import React from "react";
import FilterToken from "./FilterToken";

const FilterBar = ({ data }) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.containerView}
      showsHorizontalScrollIndicator={false}
    >
      {data.map((filter) => (
        <FilterToken label={filter} key={filter} />
      ))}
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
});

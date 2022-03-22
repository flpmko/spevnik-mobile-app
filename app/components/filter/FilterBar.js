import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import FilterToken from "./FilterToken";

const FilterBar = ({ data, seasonQuery, setSeasonQuery, handleFilter }) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.containerView}
      showsHorizontalScrollIndicator={false}
    >
      {data.map((filter) => (
        <FilterToken
          handleFilter={handleFilter}
          seasonQuery={seasonQuery}
          setSeasonQuery={setSeasonQuery}
          label={filter}
          key={filter}
        />
      ))}
      <View style={styles.containerBlank}></View>
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
});

import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import FilterToken from "./FilterToken";

const FilterBar = ({
  data,
  handleSearch,
  query,
  seasonQuery,
  setSeasonQuery,
}) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.containerView}
      showsHorizontalScrollIndicator={false}
    >
      {data.map((filter) => (
        <FilterToken
          handleSearch={handleSearch}
          seasonQuery={seasonQuery}
          setSeasonQuery={setSeasonQuery}
          query={query}
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

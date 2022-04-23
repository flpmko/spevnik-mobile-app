import { StyleSheet, View } from "react-native";
import React from "react";
import ScrollView from "rn-faded-scrollview";

import FilterToken from "./FilterToken";
import { UserContext } from "../../util/UserManager";

const FilterBar = ({ data, handleFilter }) => {
  const { theme } = React.useContext(UserContext);
  return (
    <ScrollView
      horizontal={true}
      style={styles.containerView}
      showsHorizontalScrollIndicator={false}
      allowStartFade={true}
      allowEndFade={true}
      fadeSize={50}
      fadeColors={
        theme === "light"
          ? ["rgba(245, 245, 245, 0)", "rgba(245,245,245, 1)"]
          : ["rgba(33, 33, 33, 0)", "rgba(33,33,33, 1)"]
      }
    >
      {data?.map((filter) => (
        <FilterToken handleFilter={handleFilter} label={filter} key={filter} />
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 35,
  },
});

import React from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "./SearchBar";
import FilterBar from "./filter/FilterBar";

const SearchFilterBar = ({
  filters,
  handleSearch,
  query,
  seasonQuery,
  setSeasonQuery,
  handleFilter,
}) => {
  return (
    <View>
      <View>
        <SearchBar handleSearch={handleSearch} query={query} />
      </View>
      <View style={styles.containerFilter}>
        <FilterBar
          handleFilter={handleFilter}
          seasonQuery={seasonQuery}
          setSeasonQuery={setSeasonQuery}
          data={filters}
        />
      </View>
    </View>
  );
};

export default SearchFilterBar;

const styles = StyleSheet.create({
  containerFilter: {
    paddingVertical: 5,
  },
});

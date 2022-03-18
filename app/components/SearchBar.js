import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import colors from "../config/colors";
import { ThemeContext } from "../util/ThemeManager";

const SearchBar = ({ handleSearch, query }) => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <View>
      <View style={styles.containerSearch}>
        <TextInput
          style={[styles.textInput, styles[`text${theme}`]]}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="vyhľadaj pieseň"
          placeholderTextColor={
            theme === "light"
              ? colors.light_placeholder
              : colors.dark_placeholder
          }
          keyboardType="numeric"
          clearButtonMode="always"
          value={query}
          onChangeText={(queryText) => handleSearch(queryText)}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  containerSearch: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  textInput: {
    padding: 10,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 0,
    borderRadius: 20,
    width: "98%",
    fontSize: 18,
  },
  textdark: {
    backgroundColor: colors.darkgray,
    color: colors.light,
  },
  textlight: {
    backgroundColor: colors.lightgray,
    color: colors.black,
  },
});

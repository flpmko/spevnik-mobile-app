import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

import colors from "../config/colors";
import { UserContext } from "../util/UserManager";

const SearchBar = ({ handleSearch, query, keyboard }) => {
  const { theme } = React.useContext(UserContext);
  return (
    <View style={styles.container}>
      <View style={[styles.containerSearch, styles[`container${theme}`]]}>
        <Ionicons
          name={"ios-search"}
          size={24}
          style={{ paddingRight: 5 }}
          color={colors.light_placeholder}
        />
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
          keyboardType={keyboard}
          keyboardAppearance={theme}
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
  container: {
    display: "flex",
    alignItems: "center",
    marginVertical: 10,
  },
  containerSearch: {
    width: "95 %",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 0,
    borderRadius: 20,
  },
  containerdark: {
    backgroundColor: colors.darkgray,
  },
  containerlight: {
    backgroundColor: colors.lightgray,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    backgroundColor: colors.lightgray,
    color: colors.black,
  },
});

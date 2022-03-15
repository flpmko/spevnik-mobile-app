import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Switch, View } from "react-native";

import { ThemeContext } from "../util/ThemeManager";
import colors from "../config/colors";

const SettingsScreen = () => {
  const { toggleTheme } = React.useContext(ThemeContext);
  const { theme } = React.useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggleTheme();
  };
  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <View style={styles.containerbutton}>
        <Text style={[styles.textbutton, styles[`text${theme}`]]}>
          Dark mode
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={isEnabled ? "#3e3e3e" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerbutton: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  textbutton: {
    paddingRight: 10,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

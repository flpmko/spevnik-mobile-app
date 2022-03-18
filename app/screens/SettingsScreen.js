import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Switch,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "../util/ThemeManager";
import colors from "../config/colors";
import Separator from "../components/list/Separator";

const SettingsScreen = () => {
  const { toggleTheme, theme, fontSize, changeFontSize } =
    React.useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(theme === "dark" ? true : false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggleTheme();
  };

  const handlePress = (param) => {
    changeFontSize(param);
  };

  const textStyles = StyleSheet.create({
    previewText: {
      fontSize: fontSize,
    },
  });

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <ScrollView style={{ alignSelf: "stretch", paddingTop: 10 }}>
        <View style={styles.containerbutton}>
          <Text style={[styles.textbutton, styles[`text${theme}`]]}>
            Tmavý režim
          </Text>
          <Switch
            style={{ paddingLeft: 10 }}
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isEnabled ? "#3e3e3e" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerbutton}>
          <Text style={[styles.textbutton, styles[`text${theme}`]]}>
            Veľkosť textu
          </Text>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handlePress("decrease")}
          >
            <Ionicons name={"ios-remove"} size={32} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handlePress("increase")}
          >
            <Ionicons name={"ios-add"} size={32} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handlePress("reset")}
          >
            <Ionicons name={"ios-refresh"} size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerbutton}>
          <Text style={[textStyles.previewText, styles[`text${theme}`]]}>
            {fontSize}: Hrad prepevný je Pán Boh náš
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
  },
  containerSeparator: {
    width: "100%",
    paddingVertical: 20,
  },
  containerbutton: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  textbutton: {
    paddingRight: 10,
    fontSize: 18,
  },
  sizeButton: {
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  sizeButtonColorlight: {
    backgroundColor: colors.lightgray,
  },
  sizeButtonColordark: {
    backgroundColor: "#767577",
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

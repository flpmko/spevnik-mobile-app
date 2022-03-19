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
import * as Linking from "expo-linking";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

import { ThemeContext } from "../util/ThemeManager";
import colors from "../config/colors";
import Separator from "../components/list/Separator";

const SettingsScreen = () => {
  const { toggleTheme, theme, fontSize, changeFontSize } =
    React.useContext(ThemeContext);
  const [isThemeEnabled, setIsThemeEnabled] = useState(
    theme === "dark" ? true : false
  );
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [isRotationEnabled, setIsRotationEnabled] = useState(false);

  const toggleThemeSwitch = () => {
    setIsThemeEnabled((previousIsThemeEnabled) => !previousIsThemeEnabled);
    toggleTheme();
  };

  const toggleLockSwitch = () => {
    setIsLockEnabled((previousIsLockEnabled) => !previousIsLockEnabled);
  };

  const toggleRotationSwitch = () => {
    setIsRotationEnabled(
      (previousIsRotationEnabled) => !previousIsRotationEnabled
    );
  };

  const activateSleepLock = () => {
    activateKeepAwake();
    toggleLockSwitch();
  };

  const deactivateSleepLock = () => {
    deactivateKeepAwake();
    toggleLockSwitch();
  };

  const handleFontPress = (param) => {
    changeFontSize(param);
  };

  const handleLinkPress = (route) => {
    Linking.openURL(route);
  };

  const textStyles = StyleSheet.create({
    previewText: {
      fontSize: fontSize,
    },
  });

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <ScrollView style={{ alignSelf: "stretch", paddingTop: 10 }}>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Vzhľad</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Tmavý režim
          </Text>
          <Switch
            style={{ paddingLeft: 10 }}
            ios_backgroundColor={colors.light_placeholder}
            trackColor={{ false: colors.light_placeholder, true: colors.green }}
            thumbColor={isThemeEnabled ? colors.darkergray : colors.lightergray}
            onValueChange={toggleThemeSwitch}
            value={isThemeEnabled}
          />
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Veľkosť textu
          </Text>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handleFontPress("decrease")}
          >
            <Ionicons
              name={"ios-remove"}
              size={32}
              color={theme === "dark" ? colors.secondary : colors.primarydark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handleFontPress("increase")}
          >
            <Ionicons
              name={"ios-add"}
              size={32}
              color={theme === "dark" ? colors.secondary : colors.primarydark}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
            onPress={() => handleFontPress("reset")}
          >
            <Ionicons
              name={"ios-refresh"}
              size={32}
              color={theme === "dark" ? colors.secondary : colors.primarydark}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerItem}>
          <Text style={[textStyles.previewText, styles[`text${theme}`]]}>
            {fontSize}: Hrad prepevný je Pán Boh náš
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Ovládanie</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Uzamykanie obrazovky
          </Text>
          <Switch
            style={{ paddingLeft: 10 }}
            ios_backgroundColor={colors.light_placeholder}
            trackColor={{ false: colors.light_placeholder, true: colors.green }}
            thumbColor={isThemeEnabled ? colors.darkergray : colors.lightergray}
            onValueChange={
              isLockEnabled ? deactivateSleepLock : activateSleepLock
            }
            value={isLockEnabled}
          />
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Uzamykanie otáčania
          </Text>
          <Switch
            style={{ paddingLeft: 10 }}
            ios_backgroundColor={colors.light_placeholder}
            trackColor={{ false: colors.light_placeholder, true: colors.green }}
            thumbColor={isThemeEnabled ? colors.darkergray : colors.lightergray}
            onValueChange={toggleRotationSwitch}
            value={isRotationEnabled}
          />
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Informácie</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Github projekt
          </Text>
          <View style={styles.containerRight}>
            <Text
              style={[styles.textButton, styles.textLink]}
              onPress={() =>
                handleLinkPress("https://github.com/flpmko/spevnik-mobile-app")
              }
            >
              odkaz na repozitár
            </Text>
            <Ionicons
              name={"ios-logo-github"}
              size={32}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerItem}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Vyžiadať pieseň
          </Text>
          <View style={styles.containerRight}>
            <Text style={[styles.textButton, styles.textLink]}>
              odkaz na formulár
            </Text>
          </View>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerFooter}>
          <Text style={[styles.textLabel, styles.textFooter]}>
            © Filip Šimko, 2022
          </Text>
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
  },
  containerSeparator: {
    width: "100%",
    paddingVertical: 10,
  },
  containerItem: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  containerLabel: {
    alignItems: "center",
    paddingTop: 30,
  },
  containerRight: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  containerFooter: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  textButton: {
    paddingRight: 10,
    fontSize: 18,
  },
  textLabel: {
    color: colors.darkgray,
  },
  textFooter: {
    fontSize: 12,
  },
  textLink: {
    color: colors.primary,
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

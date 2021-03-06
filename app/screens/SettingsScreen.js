import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Switch,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Appearance,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import * as Device from "expo-device";
import * as Application from "expo-application";

import { UserContext } from "../util/UserManager";
import colors from "../config/colors";
import Separator from "../components/list/Separator";
import Slider from "@react-native-community/slider";
import { clearAllData } from "../util/LocalStorage";

const SettingsScreen = () => {
  const {
    toggleTheme,
    theme,
    fontSize,
    resetFontSize,
    setFontSize,
    resetFavs,
    resetPlays,
  } = React.useContext(UserContext);
  const [isThemeEnabled, setIsThemeEnabled] = useState(
    theme === "dark" ? true : false
  );
  const [isLockEnabled, setIsLockEnabled] = useState(false);

  const info = [
    {
      _header: "SYSTEM-INFO",
      manufacturer: Device.manufacturer,
      model: Device.modelName,
      system: Device.osName,
      version: Device.osVersion,
      build: Device.osBuildId,
      theme: Appearance.getColorScheme(),
    },
    {
      _header: "APPLICATION-INFO",
      id: Application.applicationId,
      name: Application.applicationName,
      version: Application.nativeApplicationVersion,
      build: Application.nativeBuildVersion,
      theme: theme,
    },
  ];

  const toggleThemeSwitch = () => {
    setIsThemeEnabled((previousIsThemeEnabled) => !previousIsThemeEnabled);
    toggleTheme();
  };

  const toggleLockSwitch = () => {
    setIsLockEnabled((previousIsLockEnabled) => !previousIsLockEnabled);
  };

  const activateSleepLock = () => {
    activateKeepAwake();
    toggleLockSwitch();
  };

  const deactivateSleepLock = () => {
    deactivateKeepAwake();
    toggleLockSwitch();
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const sendEmail = () => {
    Linking.openURL(
      "mailto:evanjelicky.spevnik@gmail.com?subject=Nahl??senie chyby&body=\n\n" +
        formatInfo(JSON.stringify(info))
    );
  };

  const formatInfo = (string) => {
    return string
      .replace(/[\])}[{("]/g, "")
      .replace(/[,_]/g, "\n")
      .replace(/:/g, ": ")
      .replace(/header: /g, "");
  };

  const handleSliderDrag = useCallback(
    (value) => {
      setFontSize(value);
    },
    [setFontSize]
  );

  const clearCache = async (key) => {
    if (key === "playlisty") {
      await resetPlays().then(() =>
        Alert.alert(
          "Hotovo",
          "V??etky " + formatString(key) + " ??spe??ne vymazan??"
        )
      );
    } else if (key === "v??etko") {
      await clearAllData()
        .then(resetPlays())
        .then(resetFavs())
        .then(() => Alert.alert("Hotovo", "V??etky d??ta ??spe??ne vymazan??"));
    } else {
      await resetFavs().then(() =>
        Alert.alert(
          "Hotovo",
          "V??etky " + formatString(key) + " ??spe??ne vymazan??"
        )
      );
    }
  };

  const formatString = (key) => {
    switch (key) {
      case "playlists":
        return "playlisty";
      case "favorites":
        return "ob????ben??";
      default:
        return key;
    }
  };

  const onDeleteItem = (item) =>
    Alert.alert("Vymaza??", "Naozaj chcete vymaza?? " + item + "?", [
      {
        text: "Zru??i??",
        style: "cancel",
      },
      {
        text: "Odstr??ni??",
        onPress: () => clearCache(item),
        style: "destructive",
      },
    ]);

  const textStyles = StyleSheet.create({
    previewText: {
      fontSize: fontSize,
    },
  });

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <ScrollView style={{ alignSelf: "stretch", paddingTop: 10 }}>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Vzh??ad</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerCaption, styles[`background${theme}`]]}>
          <View style={styles.containerItem}>
            <Text style={[styles.textButton, styles[`text${theme}`]]}>
              Tmav?? re??im
            </Text>
            <Switch
              style={{ paddingLeft: 10 }}
              ios_backgroundColor={colors.light_placeholder}
              trackColor={{
                false: colors.light_placeholder,
                true: colors.green,
              }}
              thumbColor={
                isThemeEnabled ? colors.darkergray : colors.lightergray
              }
              onValueChange={toggleThemeSwitch}
              value={isThemeEnabled}
            />
          </View>
          <Text style={[styles.textCaption, styles[`textCaption${theme}`]]}>
            Zlep??uje ????tanie v tmav??ch podmienkach, priaznivo p??sob?? na va??e o??i
            a tie?? ??etr?? bat??riu.
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.textButton, styles[`text${theme}`]]}>
                Ve??kos?? textu
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  textStyles.textButton,
                  styles[`text${theme}`],
                  { fontSize: 30 },
                ]}
              >
                {fontSize}
              </Text>
              <TouchableOpacity
                style={[styles.sizeButton, styles[`sizeButtonColor${theme}`]]}
                onPress={resetFontSize}
              >
                <Ionicons
                  name={"ios-refresh"}
                  size={32}
                  color={
                    theme === "dark" ? colors.secondary : colors.primarydark
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Slider
            style={{ width: "100%" }}
            value={fontSize}
            step={1}
            onSlidingComplete={handleSliderDrag}
            minimumValue={10}
            maximumValue={40}
          />
        </View>
        <View
          style={[
            styles.containerItem,
            { paddingBottom: 0 },
            styles[`background${theme}`],
          ]}
        >
          <Text
            style={[
              { fontSize: 13, fontStyle: "italic" },
              styles[`text${theme}`],
            ]}
          >
            n??h??ad:
          </Text>
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[textStyles.previewText, styles[`text${theme}`]]}>
            Hrad prepevn?? je P??n Boh n????
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Ovl??danie</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerCaption, styles[`background${theme}`]]}>
          <View style={styles.containerItem}>
            <Text style={[styles.textButton, styles[`text${theme}`]]}>
              Obrazovka st??le zapnut??
            </Text>
            <Switch
              style={{ paddingLeft: 10 }}
              ios_backgroundColor={colors.light_placeholder}
              trackColor={{
                false: colors.light_placeholder,
                true: colors.green,
              }}
              thumbColor={
                isThemeEnabled ? colors.darkergray : colors.lightergray
              }
              onValueChange={
                isLockEnabled ? deactivateSleepLock : activateSleepLock
              }
              value={isLockEnabled}
            />
          </View>
          <Text style={[styles.textCaption, styles[`textCaption${theme}`]]}>
            Obrazovka zostane st??le zapnut?? po??as pou????vania aplik??cie a
            automaticky sa nevypne.
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>??lo??isko</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Vymaza?? ob????ben??
          </Text>
          <TouchableOpacity
            style={styles.containerRight}
            onPress={() => onDeleteItem("ob??uben??")}
          >
            <Text style={[styles.textButton, { color: colors.red }]}>
              vymaza??
            </Text>
            <Ionicons name={"ios-trash-bin"} size={32} color={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Vymaza?? playlisty
          </Text>
          <TouchableOpacity
            style={styles.containerRight}
            onPress={() => onDeleteItem("playlisty")}
          >
            <Text style={[styles.textButton, { color: colors.red }]}>
              vymaza??
            </Text>
            <Ionicons name={"ios-trash-bin"} size={32} color={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerCaption, styles[`background${theme}`]]}>
          <View style={[styles.containerItem, styles[`background${theme}`]]}>
            <Text style={[styles.textButton, styles[`text${theme}`]]}>
              Vymaza?? v??etko
            </Text>
            <TouchableOpacity
              style={styles.containerRight}
              onPress={() => onDeleteItem("v??etko")}
            >
              <Text style={[styles.textButton, { color: colors.red }]}>
                vymaza??
              </Text>
              <Ionicons name={"ios-trash-bin"} size={32} color={colors.red} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.textCaption, styles[`textCaption${theme}`]]}>
            Vyma??e v??etky piesne, playlisty, vy??ist?? zoznam ob????ben??ch piesn?? a
            odstr??ni v??etky d??ta, ktor?? si aplik??cia ulo??ila na va??om telef??ne.
          </Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerLabel}>
          <Text style={[styles.textLabel]}>Inform??cie</Text>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Github projekt
          </Text>
          <TouchableOpacity
            style={styles.containerRight}
            onPress={() =>
              handleLinkPress("https://github.com/flpmko/spevnik-mobile-app")
            }
          >
            <Text style={[styles.textButton, styles.textLink]}>repozit??r</Text>
            <Ionicons
              name={"ios-logo-github"}
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Vy??iada?? piese??
          </Text>
          <TouchableOpacity
            style={styles.containerRight}
            onPress={() =>
              handleLinkPress("https://forms.gle/mtpFiQSnTPUt1YND8")
            }
          >
            <Text style={[styles.textButton, styles.textLink]}>formul??r</Text>
            <Ionicons name={"open"} size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Nahl??si?? chybu v piesni
          </Text>
          <TouchableOpacity
            style={styles.containerRight}
            onPress={() =>
              handleLinkPress("https://forms.gle/BiGNYxjaU9VXHZP2A")
            }
          >
            <Text style={[styles.textButton, styles.textLink]}>formul??r</Text>
            <Ionicons name={"open"} size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={[styles.containerItem, styles[`background${theme}`]]}>
          <Text style={[styles.textButton, styles[`text${theme}`]]}>
            Nahl??si?? chybu v aplik??cii
          </Text>
          <TouchableOpacity style={styles.containerRight} onPress={sendEmail}>
            <Text style={[styles.textButton, styles.textLink]}>nahl??si??</Text>
            <Ionicons name={"bug"} size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.containerSeparator}>
          <Separator />
        </View>
        <View style={styles.containerFooter}>
          <Text style={[styles.textLabel, styles.textFooter]}>
            ?? Filip ??imko, 2022
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
  },
  containerItem: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  containerCaption: {
    flexDirection: "column",
    width: "100%",
    display: "flex",
  },
  containerLabel: {
    alignItems: "center",
    paddingTop: 30,
    marginVertical: 10,
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
  textCaption: {
    padding: 10,
    fontSize: 13,
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
  textCaptiondark: {
    color: colors.dark_placeholder,
  },
  textCaptionlight: {
    color: colors.darkgray,
  },
  backgrounddark: {
    backgroundColor: colors.darkergray,
  },
  backgroundlight: {
    backgroundColor: "white",
  },
});

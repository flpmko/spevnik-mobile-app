import React, { useCallback, useRef, useMemo, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Popover from "react-native-popover-view/dist/Popover";
import * as Linking from "expo-linking";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { ThemeContext } from "../../util/ThemeManager";
import SongDetail from "./SongDetail";
import SongsList from "./SongsList";
import Separator from "../list/Separator";

import colors from "../../config/colors";

const SongsPage = ({ screenTitle, data, filters }) => {
  const { theme } = React.useContext(ThemeContext);
  const Stack = createNativeStackNavigator();
  const bottomSheetModalRef = useRef(null);
  const [isPopoverVisible, setisPopoverVisible] = useState(false);
  const [heartIcon, setHeartIcon] = useState("heart-outline");

  const handleLinkPress = (route) => {
    Linking.openURL(route);
  };

  const togglePopover = () => {
    setisPopoverVisible(!isPopoverVisible);
  };

  const handlePress = () => {
    heartIcon === "heart-outline"
      ? setHeartIcon("ios-heart")
      : setHeartIcon("heart-outline");
  };

  // // callbacks
  const handlePresentModalPress = useCallback(() => {
    togglePopover();
    bottomSheetModalRef.current?.present();
  }, [isPopoverVisible]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SongsList"
        component={SongsList}
        filters={filters}
        data={data}
        initialParams={{ filters: filters, data: data }}
        options={{
          headerTitle: screenTitle,
          headerTintColor:
            theme === "dark" ? colors.primarydark : colors.primary,
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        bottomSheetRef={bottomSheetModalRef}
        initialParams={{ bottomSheetRef: bottomSheetModalRef }}
        options={({ route }) => {
          return {
            headerTitle: "Pieseň č. " + route.params.song.number,
            headerTintColor:
              theme === "dark" ? colors.primarydark : colors.primary,
            headerRight: () => (
              <View style={styles.containerAddButton}>
                <Ionicons
                  name={heartIcon}
                  size={28}
                  color={theme === "dark" ? colors.primarydark : colors.primary}
                  onPress={handlePress}
                />
                <Popover
                  isVisible={isPopoverVisible}
                  onRequestClose={togglePopover}
                  popoverStyle={styles.popoverStyle}
                  arrowStyle={styles.arrowStyle}
                  from={
                    <TouchableOpacity onPress={togglePopover}>
                      <Ionicons
                        name={"ellipsis-vertical"}
                        size={28}
                        color={
                          theme === "dark" ? colors.primarydark : colors.primary
                        }
                      />
                    </TouchableOpacity>
                  }
                >
                  <View>
                    <TouchableOpacity
                      style={styles.containerPopup}
                      onPress={handlePresentModalPress}
                    >
                      <Ionicons
                        name={"add"}
                        size={28}
                        style={styles.iconPopup}
                        color={
                          theme === "dark" ? colors.primarydark : colors.primary
                        }
                      />
                      <Text style={styles.textPopup}>Pridať do playlistu</Text>
                    </TouchableOpacity>
                    <Separator />
                    <TouchableOpacity
                      style={styles.containerPopup}
                      onPress={() =>
                        handleLinkPress(
                          "https://github.com/flpmko/spevnik-mobile-app"
                        )
                      }
                    >
                      <Ionicons
                        name={"bug"}
                        size={28}
                        style={styles.iconPopup}
                        color={
                          theme === "dark" ? colors.primarydark : colors.primary
                        }
                      />
                      <Text style={styles.textPopup}>Nahlásiť chybu</Text>
                    </TouchableOpacity>
                  </View>
                </Popover>
              </View>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerAddButton: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "transparent",
  },
  containerPopup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    // backgroundColor: "transparent",
  },
  iconPopup: {
    paddingHorizontal: 10,
  },
  textPopup: {
    paddingRight: 10,
  },
  popoverStyle: {
    backgroundColor: colors.light,
    opacity: 0.8,
    borderRadius: 15,
  },
  arrowStyle: {
    backgroundColor: colors.light,
  },
});

export default SongsPage;

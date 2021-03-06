import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { UserContext } from "./UserManager";
import SongsScreen from "../screens/SongsScreen";
import PlaylistsScreen from "../screens/PlaylistsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../config/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const { theme } = React.useContext(UserContext);
  function setIconName(route, focused) {
    let iconName;
    if (route.name === "Piesne") {
      iconName = focused ? "book" : "book-outline";
    } else if (route.name === "Playlisty") {
      iconName = focused ? "ios-list" : "ios-list-outline";
    } else if (route.name === "Obľúbené") {
      iconName = focused ? "ios-heart" : "ios-heart-outline";
    } else if (route.name === "Nastavenia") {
      iconName = focused ? "ios-settings" : "ios-settings-outline";
    }
    return iconName;
  }
  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: { paddingTop: 5, paddingBottom: 5, height: 60 },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = setIconName(route, focused);
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="Piesne"
            component={SongsScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Playlisty"
            component={PlaylistsScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Obľúbené"
            component={FavoritesScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Nastavenia"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTintColor:
                theme === "dark" ? colors.primarydark : colors.primary,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerlight: {
    backgroundColor: "white",
  },
  containerdark: {
    backgroundColor: "#111213",
  },
});

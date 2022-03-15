import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "./ThemeManager";

import SongsScreen from "../screens/SongsScreen";
import PlaylistsScreen from "../screens/PlaylistsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import colors from "../config/colors";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const { theme } = React.useContext(ThemeContext);
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
          headerShown: false,
          // tabBarActiveBackgroundColor: "#6692a6",
        })}
      >
        <Tab.Screen name="Piesne" component={SongsScreen} />
        <Tab.Screen name="Playlisty" component={PlaylistsScreen} />
        <Tab.Screen name="Obľúbené" component={FavoritesScreen} />
        <Tab.Screen name="Nastavenia" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import PlaylistList from "../components/playlist/PlaylistList";
import PlaylistDetail from "../components/playlist/PlaylistDetail";
import SongDetail from "../components/song/SongDetail";
import colors from "../config/colors";

const PlaylistsScreen = () => {
  const Stack = createNativeStackNavigator();
  const [heartIcon, setHeartIcon] = useState("heart-outline");
  const handlePress = () => {
    heartIcon === "heart-outline"
      ? setHeartIcon("ios-heart")
      : setHeartIcon("heart-outline");
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlaylistList"
        component={PlaylistList}
        options={{
          headerTitle: "Playlisty",
          headerTintColor: colors.primary,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                alert("add new playlist");
              }}
            >
              <View style={styles.addButtonContainer}>
                <Ionicons
                  name="md-add-circle"
                  size={32}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetail}
        options={({ route }) => {
          return {
            headerTitle: route.params.playlist.title,
            headerTintColor: colors.primary,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  alert("add new song to playlist");
                }}
              >
                <View style={styles.addButtonContainer}>
                  <Ionicons
                    name="md-add-circle"
                    size={32}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ),
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => {
          return {
            headerTitle: "Pieseň č. " + route.params.song.number,
            headerTintColor: colors.primary,
            headerRight: () => (
              <TouchableOpacity onPress={handlePress}>
                <View style={styles.addButtonContainer}>
                  <Ionicons name={heartIcon} size={32} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    width: "auto",
    display: "flex",
  },
});

export default PlaylistsScreen;

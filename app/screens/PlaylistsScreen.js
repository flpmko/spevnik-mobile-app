import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PlaylistList from "./PlaylistList";
import PlaylistDetail from "./PlaylistDetail";
import SongDetail from "./SongDetail";
import { Button, Text, View } from "react-native-web";

const PlaylistsScreen = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlaylistList"
        component={PlaylistList}
        options={{
          headerTitle: "Playlisty",
          headerRight: () => (
            <View>
              <Text>{"right"}</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetail}
        options={({ route }) => {
          return {
            headerTitle: route.params.playlist.title,
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => {
          return {
            headerTitle: "Pieseň č. " + route.params.song.number,
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default PlaylistsScreen;

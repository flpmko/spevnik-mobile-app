import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SongDetail from "./SongDetail";
import SongsList from "./SongsList";
import { Button } from "react-native-web";

function SongsScreen(props) {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SongsList"
        component={SongsList}
        options={{ headerTitle: "Piesne" }}
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
}

export default SongsScreen;

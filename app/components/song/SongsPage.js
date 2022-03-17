import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SongDetail from "./SongDetail";
import SongsList from "./SongsList";
import colors from "../../config/colors";

function SongsPage({ screenTitle, data, filters }) {
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
        name="SongsList"
        component={SongsList}
        filters={filters}
        data={data}
        initialParams={{ filters: filters, data: data }}
        options={{
          headerTitle: screenTitle,
          headerTintColor: colors.primary,
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
}

const styles = StyleSheet.create({
  addButtonContainer: {
    width: "auto",
    display: "flex",
  },
});

export default SongsPage;

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "../util/ThemeManager";
import PlaylistList from "../components/playlist/PlaylistList";
import PlaylistDetail from "../components/playlist/PlaylistDetail";
import SongDetail from "../components/song/SongDetail";
import DialogInput from "../components/dialog/DialogInput";
import playlists_data from "../data/playlists_data";

import colors from "../config/colors";

const PlaylistsScreen = () => {
  const { theme } = React.useContext(ThemeContext);
  const Stack = createNativeStackNavigator();
  const bottomSheetModalRef = useRef(null);
  const [heartIcon, setHeartIcon] = useState("heart-outline");
  const [visible, setVisible] = useState(false);
  const [newName, setNewName] = useState("");
  // const [playlists, setPlaylists] = useState([
  //   { number: 1, title: "12.3.2022", songs: {} },
  //   { number: 2, title: "Mladeznicke SB", songs: {} },
  //   { number: 3, title: "Stedry vecer 2022", songs: {} },
  // ]);
  const [playlists, setPlaylists] = useState(playlists_data);

  const createNewPlaylist = (title) => {
    // generate an unused id
    let newNumber = 1;
    let sortedListByIds = playlists.slice().sort((a, b) => a.number - b.number);
    for (let item of sortedListByIds) {
      if (newNumber === item.number) {
        newNumber++;
      }
    }
    const currentList = playlists;
    const newPlaylist = { number: newNumber, title: title, songs: [] };
    setPlaylists([...currentList, newPlaylist]);
    setNewName("");
  };

  const showPrompt = () => {
    Alert.prompt("Vyvoriť playlist", "Zadajte názov nového playlistu", [
      {
        onPress: (text) => {
          createNewPlaylist(text);
        },
      },
    ]);
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleAdd = () => {
    setVisible(false);
    createNewPlaylist(newName);
  };

  const handleInput = (input) => {
    setNewName(input);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
        playlists={playlists}
        initialParams={{ playlists: playlists }}
        options={{
          headerTitle: "Playlisty",
          headerTintColor:
            theme === "dark" ? colors.primarydark : colors.primary,
          headerRight: () => (
            <View>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={Platform.OS === "ios" ? showPrompt : showDialog}
              >
                <Ionicons
                  name="md-add-circle"
                  size={32}
                  color={theme === "dark" ? colors.primarydark : colors.primary}
                />
              </TouchableOpacity>
              <DialogInput
                visible={visible}
                add={handleAdd}
                cancel={handleCancel}
                value={newName}
                onChangeText={handleInput}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetail}
        bottomSheetRef={bottomSheetModalRef}
        initialParams={{ bottomSheetRef: bottomSheetModalRef }}
        options={({ route }) => {
          return {
            headerTitle: route.params.playlist.title,
            headerTintColor:
              theme === "dark" ? colors.primarydark : colors.primary,
            headerRight: () => (
              <TouchableOpacity onPress={handlePresentModalPress}>
                <View style={styles.addButtonContainer}>
                  <Ionicons
                    name="md-add-circle"
                    size={32}
                    color={
                      theme === "dark" ? colors.primarydark : colors.primary
                    }
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

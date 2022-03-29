import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { UserContext } from '../util/UserManager';
import PlaylistList from '../components/playlist/PlaylistList';
import PlaylistDetail from '../components/playlist/PlaylistDetail';
import SongDetail from '../components/song/SongDetail';
import DialogInput from '../components/dialog/DialogInput';
import playlists_data from '../data/playlists_data';

import colors from '../config/colors';
import { storeObjectData } from '../util/LocalStorage';

const PlaylistsScreen = () => {
  const { theme, playlists, setPlaylists } = React.useContext(UserContext);
  const Stack = createNativeStackNavigator();
  const [heartIcon, setHeartIcon] = useState('heart-outline');
  const [visible, setVisible] = useState(false);
  const [newName, setNewName] = useState('');
  // const [playlists, setPlaylists] = useState(playlists_data);

  const createNewPlaylist = async (title) => {
    // generate an unused id
    let newNumber = 1;
    if (playlists) {
      let sortedListByIds = playlists
        .slice()
        .sort((a, b) => a.number - b.number);
      for (let item of sortedListByIds) {
        if (newNumber === item.number) {
          newNumber++;
        }
      }
      const currentList = playlists;
      const newPlaylist = { number: newNumber, title: title, songs: [] };
      setPlaylists([...currentList, newPlaylist]);
    } else {
      const newPlaylist = { number: newNumber, title: title, songs: [] };
      setPlaylists([newPlaylist]);
    }
    await storeObjectData('playlists', playlists);
    setNewName('');
  };

  const showPrompt = () => {
    Alert.prompt('Vyvoriť playlist', 'Zadajte názov nového playlistu', [
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

  const handlePress = () => {
    heartIcon === 'heart-outline'
      ? setHeartIcon('ios-heart')
      : setHeartIcon('heart-outline');
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlaylistList"
        component={PlaylistList}
        playlists={playlists}
        initialParams={{ playlists: playlists }}
        options={{
          headerTitle: 'Playlisty',
          headerTintColor:
            theme === 'dark' ? colors.primarydark : colors.primary,
          headerRight: () => (
            <View>
              <TouchableOpacity
                style={styles.addButtonContainer}
                onPress={Platform.OS === 'ios' ? showPrompt : showDialog}
              >
                <Ionicons
                  name="md-add-circle"
                  size={32}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
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
        options={({ route }) => {
          return {
            headerTitle: route.params.playlist.title,
            headerTintColor:
              theme === 'dark' ? colors.primarydark : colors.primary,
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => {
          return {
            headerTitle: 'Pieseň č. ' + route.params.song?.number,
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
    width: 'auto',
    display: 'flex',
  },
});

export default PlaylistsScreen;

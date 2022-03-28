import React from 'react';
import { StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ThemeContext } from '../../util/ThemeManager';
import PlaylistItem from './PlaylistItem';
import colors from '../../config/colors';
import { storeObjectData } from '../../util/LocalStorage';

const PlaylistList = (props) => {
  const { theme, playlists, setPlaylists } = React.useContext(ThemeContext);
  const Playlists = playlists; //props.route.params.playlists;

  const onDeleteItem = (item) =>
    Alert.alert('Vymazať', 'Naozaj chcete tento playlist vymazať?', [
      {
        text: 'Zrušiť',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Odstrániť',
        onPress: () => removePlaylist(item),
        style: 'destructive',
      },
    ]);

  const removePlaylist = async (item) => {
    if (playlists) {
      const updatedPlaylists = playlists.filter((i) => i.title != item.title);
      setPlaylists(updatedPlaylists);
      await storeObjectData('playlists', updatedPlaylists);
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <FlatList
        data={Playlists}
        contentOffset={{ x: 0, y: -10 }}
        keyExtractor={(item) => item.number.toString()}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <PlaylistItem
              item={item}
              onPressItem={() =>
                props.navigation.push('PlaylistDetail', { playlist: item })
              }
              onPressIcon={() => onDeleteItem(item)}
            />
          );
        }}
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
};

export default PlaylistList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
});

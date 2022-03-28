import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  LogBox,
  View,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { filter, _ } from 'lodash';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { db } from '../../../firebase-config';
import { ThemeContext } from '../../util/ThemeManager';
import ListItem from '../list/ListItem';
import Separator from '../list/Separator';
import SearchBar from '../SearchBar';
import SearchFilterBar from '../SearchFilterBar';

import colors from '../../config/colors';

const SongsList = ({ route, navigation }) => {
  // ignore firebase timer warning for android
  LogBox.ignoreLogs(['Setting a timer']);
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf('Setting a timer') <= -1) {
      _console.warn(message);
    }
  };

  // const allSongs = props.route.params.data;
  const { theme } = React.useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [allSongs, setAllSongs] = useState([{ title: 'žiadne piesne' }]);
  const [songs, setSongs] = useState(allSongs);
  const [seasonQuery, setSeasonQuery] = useState('');
  const [query, setQuery] = useState('');
  const hymnsRef = doc(db, 'index/hymns');
  const filters = [
    'Advent',
    'Vianoce',
    'Veľká noc',
    'Pôst',
    'Vstúpenie',
    'Zoslanie',
    'Trojjediný',
    'Cirkev',
  ];

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getStoredData = async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.log(e.message);
    }
    return null;
  };

  const storeObjectData = async (key, object) => {
    try {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getStoredObjectData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchSongs = async () => {
    const data = await getDoc(hymnsRef);
    const lastChangeDb = data.get('lastChange').valueOf();
    const hymnsData = data.get('all');
    const lastChangeLocal = await getStoredData('lastChange');
    if (lastChangeLocal) {
      if (lastChangeLocal !== lastChangeDb) {
        storeData('lastChange', lastChangeDb);
        storeObjectData('hymnsData', hymnsData);
        setAllSongs(hymnsData);
        setSongs(hymnsData);
      }
    }
  };

  // initialize from local storage
  const initFromLocal = async () => {
    const data = await getStoredObjectData('hymnsData');
    setAllSongs(data);
    setSongs(data);
  };

  const initializeData = async () => {
    setLoading(true);
    await initFromLocal();
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable) {
      await fetchSongs();
    }
    setLoading(false);
  };

  // search helper function
  const contains = ({ number }, input) => {
    if (number.toString().startsWith(input)) {
      return true;
    }
    return false;
  };

  // search the list of hymns based on number
  const handleSearch = (input) => {
    let dataSet;
    // if (seasonQuery) {
    //   dataSet = songs;
    // } else {
    //   dataSet = allSongs;
    // }
    dataSet = allSongs;
    const data = filter(dataSet, (song) => {
      return contains(song, input);
    });
    setSongs(data);
    setQuery(input);
  };

  // filter the list of hymns based on season
  const handleFilter = () => {
    if (seasonQuery === '') {
      setSongs(allSongs);
    } else {
      setSongs(
        allSongs.filter(function (el) {
          return el.season == seasonQuery;
        })
      );
    }
  };

  // sort list of hymns as ascending based on numbers
  const sortHymns = () => {};

  const goToSong = (item) => {
    navigation.push('SongDetail', { song: item });
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      {!loading ? (
        <FlatList
          data={songs}
          keyExtractor={(item) => item?.number}
          renderItem={({ item }) => {
            return <ListItem item={item} onPress={() => goToSong(item)} />;
          }}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            route.params.filters ? (
              <SearchFilterBar
                filters={filters}
                handleFilter={handleFilter}
                query={query}
                handleSearch={handleSearch}
                seasonQuery={seasonQuery}
                setSeasonQuery={setSeasonQuery}
              />
            ) : (
              <SearchBar handleSearch={handleSearch} query={query} />
            )
          }
        />
      ) : (
        <View>
          <Text>loading</Text>
        </View>
      )}
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
};

export default SongsList;

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
  containerSearch: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textInput: {
    backgroundColor: colors.lightgray,
    padding: 10,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    width: '98%',
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
});

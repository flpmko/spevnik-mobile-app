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
import NetInfo from '@react-native-community/netinfo';

import { db } from '../../../firebase-config';
import { ThemeContext } from '../../util/ThemeManager';
import {
  getStoredData,
  getStoredObjectData,
  storeData,
  storeObjectData,
} from '../../util/LocalStorage';
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
  const { theme, favorites } = React.useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [allSongs, setAllSongs] = useState(
    route.params.filters ? undefined : favorites
  );
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
      const myData = [].concat(allSongs).filter(function (el) {
        return el?.season == seasonQuery;
      });
      setSongs(myData);
    }
  };

  const goToSong = (item) => {
    navigation.push('SongDetail', { song: item });
  };

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      let locData;
      if (route.params.filters) {
        locData = await getStoredObjectData(
          route.params.filters ? 'hymnsData' : 'favorites'
        );
      } else {
        locData = favorites;
      }
      locData.sort((a, b) => a?.number - b?.number);
      setAllSongs(locData);
      setSongs(locData);
      if (route.params.filters) {
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable) {
          const data = await getDoc(hymnsRef);
          const lastChangeDb = data.get('lastChange').valueOf();
          const hymnsData = data
            .get('all')
            .sort((a, b) => a?.number - b?.number);
          const lastChangeLocal = await getStoredData('lastChange');
          if (lastChangeLocal) {
            if (lastChangeLocal !== lastChangeDb) {
              await storeData('lastChange', lastChangeDb);
              await storeObjectData('hymnsData', hymnsData);
              setAllSongs(hymnsData);
              setSongs(hymnsData);
            }
          }
        }
      }
      setLoading(false);
    };
    setup();
  }, []);

  useEffect(() => {
    setSongs(route.params.filters ? songs : favorites);
  }, [favorites]);

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

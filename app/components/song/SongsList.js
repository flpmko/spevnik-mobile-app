import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  LogBox,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Popover from 'react-native-popover-view/dist/Popover';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { filter, _ } from 'lodash';
import { doc, getDoc } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';

import { db } from '../../../firebase-config';
import { UserContext } from '../../util/UserManager';
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
import songs_data from '../../data/songs_data';

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
  const { theme, favorites, seasons, setSeasons } =
    React.useContext(UserContext);
  const [showFilters, setShowFilters] = useState(route.params.filters);
  const [loading, setLoading] = useState(false);
  const [allSongs, setAllSongs] = useState(
    route.params.filters ? songs_data : favorites
  );
  const [songs, setSongs] = useState(allSongs);
  const [hymns, setHymns] = useState([]);
  const [modern, setModern] = useState([]);
  const [seasonQuery, setSeasonQuery] = useState('');
  const [query, setQuery] = useState('');

  const hymnsRef = doc(db, 'index/hymns');
  const songsRef = doc(db, 'index/songs');

  const [isPopoverVisible, setisPopoverVisible] = useState(false);

  const togglePopover = () => {
    setisPopoverVisible(!isPopoverVisible);
  };

  const handleLibraryChange = (library) => {
    togglePopover();
    if (library === 'songs') {
      setSongs(allSongs);
      setShowFilters(true);
    } else {
      setSongs(modern);
      setShowFilters(false);
    }
  };

  // search helper function
  const contains = ({ number }, input) => {
    if (number?.toString().startsWith(input)) {
      return true;
    }
    return false;
  };

  // search the list of hymns based on number
  const handleSearch = (input) => {
    let dataSet;
    showFilters ? (dataSet = allSongs) : (dataSet = modern);
    const data = filter(dataSet, (song) => {
      return contains(song, input);
    });
    setSongs(data);
    setQuery(input);
  };

  // filter the list of hymns based on season
  const handleFilter = (filterQuery) => {
    if (filterQuery === '') {
      setSongs(allSongs);
    } else {
      const myData = [].concat(allSongs).filter(function (el) {
        return el?.season == filterQuery;
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
      let locData, locDataMod;
      if (showFilters) {
        locData = await getStoredObjectData('hymnsData');
        locDataMod = await getStoredObjectData('modern');
      } else {
        locData = favorites;
      }
      locData.sort((a, b) => a?.number - b?.number);
      if (locData) {
        setAllSongs(locData);
        setSongs(locData);
      }
      if (locDataMod) setModern(locDataMod);
      if (showFilters) {
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable) {
          const data = await getDoc(hymnsRef);
          const songsDoc = await getDoc(songsRef);
          const lastChangeDb = data.get('lastChange').valueOf();
          const seasonsData = data.get('seasons');
          const songsData = songsDoc.get('all');
          const hymnsData = data
            .get('all')
            .sort((a, b) => a?.number - b?.number);
          const lastChangeLocal = await getStoredData('lastChange');
          if (lastChangeLocal) {
            if (lastChangeLocal !== lastChangeDb) {
              await storeData('lastChange', lastChangeDb);
              await storeObjectData('hymnsData', hymnsData);
              await storeObjectData('seasons', seasonsData);
              await storeObjectData('modern', songsData);
              setAllSongs(hymnsData);
              setSeasons(seasonsData);
              setSongs(hymnsData);
              setModern(songsData);
            }
          }
          if (!modern) {
            console.log('nejsu');
            await storeObjectData('modern', songsData);
            setModern(songsData);
          }
          if (!seasons) {
            await storeObjectData('seasons', seasonsData);
            setSeasons(seasonsData);
          }
        }
      }
      setLoading(false);
    };
    setup();
  }, []);

  useEffect(() => {
    setSongs(showFilters ? songs : favorites);
  }, [favorites]);

  useLayoutEffect(() => {
    if (route.params.filters) {
      navigation.setOptions({
        headerRight: () => (
          <Popover
            isVisible={isPopoverVisible}
            onRequestClose={togglePopover}
            popoverStyle={styles.popoverStyle}
            arrowStyle={styles.arrowStyle}
            from={
              <TouchableOpacity onPress={togglePopover}>
                <Ionicons
                  name={'book'}
                  size={28}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
              </TouchableOpacity>
            }
          >
            <View>
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={() => handleLibraryChange('songs')}
              >
                <Ionicons
                  name={showFilters ? 'checkmark' : 'file-tray-full'}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
                <Text style={styles.textPopup}>Spevníkové</Text>
              </TouchableOpacity>
              <Separator />
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={() => handleLibraryChange('modern')}
              >
                <Ionicons
                  name={showFilters ? 'file-tray-full' : 'checkmark'}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
                <Text style={styles.textPopup}>Mládežnícke</Text>
              </TouchableOpacity>
            </View>
          </Popover>
        ),
      });
    }
  });

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      {!loading ? (
        <FlatList
          data={songs}
          keyExtractor={(item) => (item.number ? item.number : item.title)}
          renderItem={({ item }) => {
            return <ListItem item={item} onPress={() => goToSong(item)} />;
          }}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            showFilters ? (
              <SearchFilterBar
                filters={seasons}
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
  containerAddButton: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
  },
  containerPopup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  iconPopup: {
    paddingHorizontal: 10,
  },
  textPopup: {
    paddingRight: 10,
  },
  popoverStyle: {
    backgroundColor: colors.light,
    opacity: 1,
    borderRadius: 15,
  },
  arrowStyle: {
    backgroundColor: colors.light,
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

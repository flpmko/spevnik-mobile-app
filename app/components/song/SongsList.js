import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  LogBox,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Popover from "react-native-popover-view/dist/Popover";
import { Ionicons } from "@expo/vector-icons";
import { filter, _ } from "lodash";
import { doc, getDoc } from "firebase/firestore";
import NetInfo from "@react-native-community/netinfo";

import { db } from "../../../firebase-config";
import { UserContext } from "../../util/UserManager";
import {
  getStoredData,
  getStoredObjectData,
  storeData,
  storeObjectData,
} from "../../util/LocalStorage";
import ListItem from "../list/ListItem";
import Separator from "../list/Separator";
import SearchFilterBar from "../SearchFilterBar";
import SearchBar from "../SearchBar";

import colors from "../../config/colors";

const SongsList = ({ route, navigation }) => {
  // ignore firebase timer warning for android
  LogBox.ignoreLogs(["Setting a timer"]);
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
      _console.warn(message);
    }
  };

  const { theme, favorites, seasons, setSeasons } =
    React.useContext(UserContext);
  const [showFilters, setShowFilters] = useState(route.params.filters);
  const [loading, setLoading] = useState(false);
  const [allSongs, setAllSongs] = useState(
    route.params.filters ? null : favorites
  );
  const [songs, setSongs] = useState(allSongs);
  const [hymns, setHymns] = useState([]);
  const [modern, setModern] = useState([]);
  const [seasonQuery, setSeasonQuery] = useState("");
  const [query, setQuery] = useState("");

  const hymnsRef = doc(db, "index/hymns");
  const songsRef = doc(db, "index/songs");
  const timesRef = doc(db, "index/timestamps");

  const [isPopoverVisible, setisPopoverVisible] = useState(false);

  const togglePopover = () => {
    setisPopoverVisible(!isPopoverVisible);
  };

  const handleLibraryChange = (library) => {
    togglePopover();
    if (library === "songs") {
      setSongs(allSongs);
      setShowFilters(true);
    } else {
      setSongs(modern);
      setShowFilters(false);
    }
  };

  // search helper function
  const contains = ({ number, title }, input) => {
    if (number?.toString().startsWith(input)) {
      return true;
    }
    if (title.toLowerCase().startsWith(input)) {
      return true;
    }
    return false;
  };

  // search the list of hymns based on number
  const handleSearch = (input) => {
    let dataSet;
    if (showFilters) {
      dataSet = allSongs;
    } else {
      dataSet = modern;
    }
    const data = filter(dataSet, (song) => {
      return contains(song, input);
    });
    setSongs(data);
    setQuery(input);
  };

  // filter the list of hymns based on season
  const handleFilter = (filterQuery) => {
    if (filterQuery === "") {
      setSongs(allSongs);
    } else {
      const myData = [].concat(allSongs).filter(function (el) {
        return el?.season == filterQuery;
      });
      setSongs(myData);
    }
  };

  const goToSong = (item) => {
    navigation.push("SongDetail", { song: item });
  };

  const fetchFromDb = async () => {
    const timesDoc = await getDoc(timesRef);
    const timeHymnsDb = timesDoc.get("hymns").valueOf();
    const timeSongsDb = timesDoc.get("songs").valueOf();
    const timeHymnsLocal = await getStoredData("timeHymnsLocal");
    const timeSongsLocal = await getStoredData("timeSongsLocal");

    if (timeHymnsLocal !== timeHymnsDb || !seasons || !songs) {
      await storeData("timeHymnsLocal", timeHymnsDb);
      const hymnsDoc = await getDoc(hymnsRef);
      const hymnsData = hymnsDoc
        .get("all")
        .sort((a, b) => a?.number - b?.number);
      const seasonsData = hymnsDoc.get("seasons");
      await storeObjectData("hymnsData", hymnsData);
      await storeObjectData("seasons", seasonsData);
      setAllSongs(hymnsData);
      setSeasons(seasonsData);
      setSongs(hymnsData);
    }

    if (timeSongsLocal !== timeSongsDb || !modern) {
      await storeData("timeSongsLocal", timeSongsDb);
      const songsDoc = await getDoc(songsRef);
      const songsData = songsDoc
        .get("all")
        .sort((a, b) => (a.title > b.title ? 1 : -1));
      await storeObjectData("modern", songsData);
      setModern(songsData);
    }
  };

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      let locData, locDataMod;
      if (showFilters) {
        locData = await getStoredObjectData("hymnsData");
        locData?.sort((a, b) => a?.number - b?.number);
        locDataMod = await getStoredObjectData("modern");
        locDataMod?.sort((a, b) => (a.title > b.title ? 1 : -1));
      } else {
        locData = favorites;
        locData?.sort((a, b) => (a.title > b.title ? 1 : -1));
      }
      if (locData) {
        setAllSongs(locData);
        setSongs(locData);
      }
      if (locDataMod) {
        setModern(locDataMod);
      }
      if (showFilters) {
        NetInfo.fetch().then(async (state) => {
          if (state.isConnected) {
            await fetchFromDb();
          } else {
            if (locData === null) {
              Alert.alert(
                "Upozornenie",
                "Pre prvé spustenie aplikácie a načítanie piesní je potrebné internetové pripojenie. Vypnite prosím aplikáciu, pripojte sa na internet a potom aplikáciu opäť spustite.",
                [
                  {
                    text: "Restart",
                  },
                ]
              );
            }
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
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
                  name={"book"}
                  size={28}
                  color={theme === "dark" ? colors.primarydark : colors.primary}
                />
              </TouchableOpacity>
            }
          >
            <View>
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={() => handleLibraryChange("songs")}
              >
                <Ionicons
                  name={showFilters ? "checkmark" : "file-tray-full"}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === "dark" ? colors.primarydark : colors.primary}
                />
                <Text style={styles.textPopup}>Spevníkové</Text>
              </TouchableOpacity>
              <Separator />
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={() => handleLibraryChange("modern")}
              >
                <Ionicons
                  name={showFilters ? "file-tray-full" : "checkmark"}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === "dark" ? colors.primarydark : colors.primary}
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
    <View style={[styles.container, styles[`container${theme}`]]}>
      {!loading ? (
        <FlatList
          data={songs}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          keyExtractor={(item) => (item.number ? item.number : item.title)}
          renderItem={({ item }) => {
            return <ListItem item={item} onPress={() => goToSong(item)} />;
          }}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={() => <Separator />}
          ListHeaderComponent={
            route.params.filters ? (
              showFilters ? (
                <SearchFilterBar
                  filters={seasons}
                  handleFilter={handleFilter}
                  query={query}
                  handleSearch={handleSearch}
                  seasonQuery={seasonQuery}
                  setSeasonQuery={setSeasonQuery}
                  keyboard={
                    Platform.OS === "ios" ? "name-phone-pad" : "default"
                  }
                />
              ) : (
                <SearchBar
                  handleSearch={handleSearch}
                  query={query}
                  keyboard="default"
                />
              )
            ) : (
              <View style={styles.containerFavs}>
                <Text style={[styles.textFavs, styles[`textFavs${theme}`]]}>
                  Všetky tvoje obľúbené piesne na jednom mieste.
                </Text>
              </View>
            )
          }
        />
      ) : (
        <View style={[styles.containerSpinner, styles.horizontal]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default SongsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerSpinner: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  containerSearch: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  containerAddButton: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
  },
  containerPopup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
  containerFavs: {
    display: "flex",
    flex: 1,
    // height: 20,
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
  textFavs: {
    fontSize: 30,
    padding: 10,
  },
  textInput: {
    backgroundColor: colors.lightgray,
    padding: 10,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    width: "98%",
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
  textFavsdark: {
    // color: colors.darkgray,
    color: colors.primarydark,
    opacity: 0.3,
  },
  textFavslight: {
    // color: colors.dark_placeholder,
    color: colors.primary,
    opacity: 0.3,
  },
});

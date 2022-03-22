import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { filter } from "lodash";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "../../util/ThemeManager";
import Separator from "../list/Separator";
import colors from "../../config/colors";
import PlaylistListItem from "./PlaylistListItem";
import songs_data from "../../data/songs_data";
import SearchBar from "../SearchBar";
import PlaylistListItemDragable from "./PlaylistListItemDragable";

const PlaylistDetail = ({ navigation, route }) => {
  const { theme } = React.useContext(ThemeContext);
  const bottomSheetModalRef = useRef(null);
  const AllSongs = songs_data;
  const [filteredSongs, setFilteredSongs] = useState(AllSongs);
  // song of the playlist
  const [songs, setSongs] = useState(route.params.playlist.songs);
  const [query, setQuery] = useState("");

  // search helper function
  const contains = ({ number }, input) => {
    if (number.toString().startsWith(input)) {
      return true;
    }
    return false;
  };

  // search based on hymn number
  const handleSearch = (input) => {
    const data = filter(AllSongs, (song) => {
      return contains(song, input);
    });
    setFilteredSongs(data);
    setQuery(input);
  };

  // showing bottom sheet modal
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // variables for bottom sheet modal
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // handling bottom sheet
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBottomSheetItem = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.modalText}>{item.number}</Text>
        <Text style={styles.modalText} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    []
  );

  const renderBottomSheetHeader = useCallback(() => (
    <View style={styles.containerSh}>
      <View style={[styles.containerSearch, styles[`container${theme}`]]}>
        <Ionicons
          name={"ios-search"}
          size={24}
          style={{ paddingRight: 5 }}
          color={colors.light_placeholder}
        />
        <BottomSheetTextInput
          value={query}
          onChangeText={(queryText) => handleSearch(queryText)}
          style={styles.textInput}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="vyhľadaj pieseň"
          placeholderTextColor={
            theme === "light"
              ? colors.light_placeholder
              : colors.dark_placeholder
          }
          keyboardType="numeric"
          keyboardAppearance={theme}
          clearButtonMode="always"
        />
      </View>
      <TouchableOpacity
        style={{ flex: 1, marginHorizontal: 10 }}
        onPress={handleDismissModalPress}
      >
        <Ionicons name={"close"} size={32} color={colors.light_placeholder} />
      </TouchableOpacity>
    </View>
  ));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handlePresentModalPress}>
          <View style={styles.addButtonContainer}>
            <Ionicons
              name="md-add-circle"
              size={32}
              color={theme === "dark" ? colors.primarydark : colors.primary}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          keyboardBehavior="extend"
          style={[
            styles.shadow,
            styles[`container${theme}`],
            styles[`shadow${theme}`],
          ]}
        >
          <BottomSheetFlatList
            data={filteredSongs}
            keyExtractor={(song) => song.number.toString()}
            renderItem={renderBottomSheetItem}
            contentContainerStyle={[styles.contentContainer]}
            ListHeaderComponent={renderBottomSheetHeader}
          />
        </BottomSheetModal>
      </View>
      <DraggableFlatList
        data={songs}
        style={styles.containerList}
        keyExtractor={(item) => item.number}
        onDragEnd={() => setSongs(songs)}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
        renderItem={(item) => (
          <PlaylistListItemDragable
            item={item}
            onPress={() => navigation.push("SongDetail", { song: item.item })}
          />
        )}
      />
      {/* <FlatList
        style={styles.containerList}
        data={songs}
        keyExtractor={(item) => item.number}
        renderItem={({ item }) => {
          return (
            <PlaylistListItem
              item={item}
              onPress={() => navigation.push("SongDetail", { song: item })}
            />
          );
        }}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
      /> */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20.0,

    elevation: 25,
  },
  shadowlight: {
    shadowColor: "#000",
  },
  shadowdark: {
    shadowColor: "#ffffff",
  },
  containerSh: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  containerSearch: {
    // width: "95 %",
    flex: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginLeft: 10,
    borderWidth: 0,
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
  },
  rowItem: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  containerSearchBar: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: "row",
    margin: 6,
    borderRadius: 15,
    borderWidth: 0,
    backgroundColor: colors.lightgray,
  },
  modalText: {
    paddingLeft: 30,
    fontSize: 25,
  },
  containerList: {
    height: "100%",
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
});

export default PlaylistDetail;

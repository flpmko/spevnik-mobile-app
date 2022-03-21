import React, { useCallback, useMemo, useState } from "react";
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
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import DraggableFlatList from "react-native-draggable-flatlist";

import { ThemeContext } from "../../util/ThemeManager";
import Separator from "../list/Separator";
import colors from "../../config/colors";
import PlaylistListItem from "./PlaylistListItem";
import songs_data from "../../data/songs_data";
import SearchBar from "../SearchBar";
import PlaylistListItemDragable from "./PlaylistListItemDragable";

const PlaylistDetail = ({ navigation, route }) => {
  const AllSongs = songs_data;
  const { theme } = React.useContext(ThemeContext);
  const [songs, setSongs] = useState(route.params.playlist.songs);
  const [filteredSongs, setFilteredSongs] = useState(AllSongs);
  const [query, setQuery] = useState("");

  const contains = ({ number }, input) => {
    if (number.toString().startsWith(input)) {
      return true;
    }
    return false;
  };

  const handleSearch = (input) => {
    const data = filter(AllSongs, (song) => {
      return contains(song, input);
    });
    setFilteredSongs(data);
    setQuery(input);
  };
  const bottomSheetModalRef = route.params.bottomSheetRef;

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem = useCallback(
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

  return (
    <SafeAreaView style={[styles.container, styles[`container${theme}`]]}>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetFlatList
            data={filteredSongs}
            keyExtractor={(song) => song.number}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
              <SearchBar handleSearch={handleSearch} query={query} />
            }
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

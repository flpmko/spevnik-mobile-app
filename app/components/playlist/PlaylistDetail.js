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
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { ThemeContext } from "../../util/ThemeManager";
import Separator from "../list/Separator";
import colors from "../../config/colors";
import PlaylistListItem from "./PlaylistListItem";
import songs_data from "../../data/songs_data";
import SearchBar from "../SearchBar";
import PlaylistListItemDragable from "./PlaylistListItemDragable";

const PlaylistDetail = ({ navigation, route }) => {
  const { theme } = React.useContext(ThemeContext);
  const [songs, setSongs] = useState(route.params.playlist.songs);
  const AllSongs = songs_data;
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

  const renderListItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : item.backgroundColor },
          ]}
        >
          <PlaylistListItem
            item={item}
            onPress={() => navigation.push("SongDetail", { song: item })}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

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
            data={AllSongs}
            keyExtractor={(song) => song.number}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={SearchBar}
          />
        </BottomSheetModal>
      </View>
      <DraggableFlatList
        data={songs}
        style={styles.containerList}
        keyExtractor={(item) => item.number}
        onDragEnd={({ songs }) => setSongs(songs)}
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

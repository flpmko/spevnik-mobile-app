import React, { useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { ThemeContext } from "../../util/ThemeManager";
import colors from "../../config/colors";
import playlists_data from "../../data/playlists_data";

const SongDetail = ({ route }) => {
  const Playlists = playlists_data;
  const { theme, fontSize } = React.useContext(ThemeContext);
  const bottomSheetModalRef = route.params.bottomSheetRef;

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.modalText}>{item.title}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const textStyles = StyleSheet.create({
    textText: {
      fontSize: fontSize,
    },
  });

  return (
    <SafeAreaView>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetFlatList
            data={Playlists}
            keyExtractor={(playlist) => playlist.number}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        </BottomSheetModal>
      </View>
      <ScrollView style={[styles.container, styles[`container${theme}`]]}>
        {/* <DropMenu /> */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText]}>{route.params.song.title}</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, styles[`text${theme}`]]}>
            {route.params.song.category},
          </Text>
          <Text style={[styles.categoryText, styles[`text${theme}`]]}>
            {" "}
            {route.params.song.season}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[textStyles.textText, styles[`text${theme}`]]}>
            {route.params.song.text}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongDetail;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    height: "100%",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    paddingVertical: 10,
    margin: 6,
    borderRadius: 15,
    borderWidth: 0,
    backgroundColor: colors.lightgray,
  },
  modalText: {
    paddingLeft: 30,
    fontSize: 25,
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
  titleContainer: {
    display: "flex",
  },
  titleText: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primary,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
  },
  categoryText: {
    fontStyle: "italic",
  },
  textContainer: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 100,
  },
});

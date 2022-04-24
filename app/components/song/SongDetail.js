import React, {
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
  useMemo,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { UserContext } from "../../util/UserManager";
import { storeObjectData } from "../../util/LocalStorage";
import colors from "../../config/colors";

const SongDetail = ({ route, navigation }) => {
  const { theme, fontSize, favorites, setFavorites, playlists } =
    React.useContext(UserContext);
  const Playlists = playlists;
  const [heartIcon, setHeartIcon] = useState("heart-outline");
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.containerItem, styles[`containerItem${theme}`]]}
        onPress={() => addToPlaylist(item)}
      >
        <Text style={[styles.textModal, styles[`text${theme}`]]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    ),
    []
  );

  const addToPlaylist = (playlist) => {
    const song = route.params.song;
    var index = playlist.songs.findIndex((x) => x.title == song.title);
    if (index === -1) {
      playlist.songs.push(song);
      storeObjectData("playlists", playlists);
      handleDismissModalPress();
    } else {
      alert("Pieseň už v tomto playliste je");
    }
  };

  const textStyles = StyleSheet.create({
    textText: {
      fontSize: fontSize,
    },
  });

  const handlePress = () => {
    if (heartIcon === "heart-outline") {
      setHeartIcon("ios-heart");
      addFavorite();
    } else {
      setHeartIcon("heart-outline");
      removeFavorite();
    }
  };

  const addFavorite = async () => {
    if (favorites) {
      favorites.push(route.params.song);
      await storeObjectData("favorites", favorites);
    } else {
      const newFavorites = [route.params.song];
      await storeObjectData("favorites", newFavorites);
    }
  };

  const removeFavorite = async () => {
    if (favorites) {
      const updatedFavorites = favorites.filter(
        (item) => item.title != route.params.song.title
      );
      setFavorites(updatedFavorites);
      await storeObjectData("favorites", updatedFavorites);
    }
  };

  const isFavorite = async () => {
    if (favorites?.some((item) => route.params.song.title === item.title)) {
      setHeartIcon("ios-heart");
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderHeaderComponent = useCallback(() => (
    <TouchableOpacity
      style={{
        flex: 1,
        marginHorizontal: 10,
        alignItems: "flex-end",
      }}
      onPress={handleDismissModalPress}
    >
      <Ionicons name={"close"} size={32} color={colors.light_placeholder} />
    </TouchableOpacity>
  ));

  useEffect(() => {
    isFavorite();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.containerAddButton}>
          <Ionicons
            name={heartIcon}
            size={28}
            color={theme === "dark" ? colors.primarydark : colors.primary}
            onPress={handlePress}
          />
          <MaterialIcons
            name={"playlist-add"}
            style={{ paddingLeft: 10 }}
            size={28}
            color={theme === "dark" ? colors.primarydark : colors.primary}
            onPress={handlePresentModalPress}
          />
        </View>
      ),
    });
  }, [navigation, heartIcon]);

  return (
    <SafeAreaView>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          style={[styles.shadow, styles[`shadow${theme}`]]}
          backgroundStyle={[styles[`containerSheet${theme}`]]}
          snapPoints={snapPoints}
        >
          <BottomSheetFlatList
            data={Playlists}
            keyExtractor={(playlist) => playlist.number}
            renderItem={renderItem}
            ListHeaderComponent={renderHeaderComponent}
            containerContentStyle={styles.containerContent}
          />
        </BottomSheetModal>
      </View>
      <ScrollView style={[{ height: "100%" }, styles[`container${theme}`]]}>
        <View style={styles.containerHeader}>
          <View style={styles.containerTitle}>
            <Text style={[styles.textTitle]}>{route.params.song?.title}</Text>
          </View>
          {route.params.song.season ? (
            <View style={styles.containerCategory}>
              <Text style={[styles.textCategory, styles[`text${theme}`]]}>
                {route.params.song.season}
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.containerChords}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {route.params.song.chords.map((e, i) => (
                <View
                  key={i}
                  style={[
                    styles.containerChordItem,
                    styles[`containerChordItem${theme}`],
                  ]}
                >
                  <Text style={[styles.textChord, styles[`textChord${theme}`]]}>
                    {e}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        <View style={[styles.containerText, styles.container]}>
          {route.params.song?.verses?.map(function (item, i) {
            return (
              <View style={styles.containerVerse} key={i}>
                <Text
                  style={[
                    textStyles.textText,
                    styles[`text${theme}`],
                    styles.textVerse,
                  ]}
                >
                  {i + 1}.
                </Text>
                <Text style={[textStyles.textText, styles[`text${theme}`]]}>
                  {item}
                </Text>
              </View>
            );
          })}
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
  containerChordItem: {
    minHeight: 50,
    minWidth: 50,
    borderRadius: 15,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    display: "flex",
    paddingHorizontal: 10,
  },
  containerChordItemlight: {
    backgroundColor: colors.lightgray,
  },
  containerChordItemdark: {
    backgroundColor: colors.darkgray,
  },
  containerChords: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  containerAddButton: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
  },
  containerVerse: {
    paddingVertical: 10,
  },
  containerText: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 100,
  },
  containerPopup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
  },
  containerContent: {
    backgroundColor: "white",
  },
  containerItem: {
    paddingVertical: 10,
    margin: 6,
    borderRadius: 15,
    borderWidth: 0,
  },
  containerTitle: {
    display: "flex",
  },
  containerHeader: {
    display: "flex",
    paddingTop: 20,
    paddingLeft: 20,
  },
  containerCategory: {
    display: "flex",
    flexDirection: "row",
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  containerSheetlight: {
    backgroundColor: colors.light,
  },
  containerSheetdark: {
    backgroundColor: colors.darkergray,
  },
  containerItemlight: {
    backgroundColor: colors.lightgray,
  },
  containerItemdark: {
    backgroundColor: colors.dark,
  },
  iconPopup: {
    paddingHorizontal: 10,
  },
  textChord: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textChordlight: {
    color: colors.darkgray,
  },
  textChorddark: {
    color: colors.lightgray,
  },
  textPopup: {
    paddingRight: 10,
  },
  textVerse: {
    fontWeight: "bold",
    color: colors.dark_placeholder,
  },
  popoverStyle: {
    backgroundColor: colors.light,
    opacity: 1,
    borderRadius: 15,
  },
  arrowStyle: {
    backgroundColor: colors.light,
  },
  textModal: {
    paddingLeft: 30,
    fontSize: 25,
  },
  textTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: colors.primary,
  },
  textCategory: {
    fontStyle: "italic",
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
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
});

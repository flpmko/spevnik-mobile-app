import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  UIManager,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { filter } from 'lodash';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import Animated from "react-native-reanimated";
import SwipeableItem, {
  useSwipeableItemParams,
} from "react-native-swipeable-item";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { UserContext } from '../../util/UserManager';
import Separator from '../list/Separator';
import colors from '../../config/colors';
import songs_data from '../../data/songs_data';
import { storeObjectData } from '../../util/LocalStorage';
import { useNavigation } from '@react-navigation/native';

type Item = {
  number: number;
  title: string;
  category: string;
  season: string;
  text: string;
};

const { multiply, sub } = Animated;

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const OVERSWIPE_DIST = 10;

const PlaylistDetail = ({ navigation, route }) => {
  const { theme, playlists } = React.useContext(UserContext);
  const AllSongs = songs_data;
  const itemRefs = useRef(new Map());

  const bottomSheetModalRef = useRef(null);
  const [filteredSongs, setFilteredSongs] = useState(AllSongs);

  // song of the playlist
  const [songs, setSongs] = useState(route.params.playlist.songs);
  const [query, setQuery] = useState('');

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
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const updateSongs = async (data) => {
    setSongs(data);
    route.params.playlist.songs = data;
    const playlist = route.params.playlist;
    var index = playlists.findIndex((x) => x.title == playlist.title);
    if (index !== -1) {
      playlists[index] = playlist;
    }
    await storeObjectData('playlists', playlists);
  };

  const renderItem = useCallback((params: RenderItemParams<Item>) => {
    return <RowItem {...params} playlist={route.params.playlist.title} itemRefs={itemRefs}/>
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
          name={'ios-search'}
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
            theme === 'light'
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
        <Ionicons name={'close'} size={32} color={colors.light_placeholder} />
      </TouchableOpacity>
    </View>
  ), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handlePresentModalPress}>
          <View>
            <Ionicons
              name="md-add-circle"
              size={32}
              color={theme === 'dark' ? colors.primarydark : colors.primary}
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
        keyExtractor={(item: Item) => (item.title)}
        onDragEnd={({ data }) => updateSongs(data)}
        activationDistance={10}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <Separator />}
        ListFooterComponent={() => <Separator />}
        renderItem={renderItem}
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
};

type RowItemProps = {
  item: Item;
  playlist: string;
  drag: () => void;
  itemRefs: React.MutableRefObject<Map<any, any>>;
};

function RowItem({ item, playlist, itemRefs, drag }: RowItemProps) {
  const { theme } = React.useContext(UserContext);
  type StackParamList = {
    SongDetail: { song: Item }
}

type NavigationProps = NativeStackNavigationProp<StackParamList>;
  const navigation = useNavigation<NavigationProps>();

  return (
    <ScaleDecorator>
      <SwipeableItem
        key={item.title}
        item={item}
        ref={(ref) => {
          if (ref && !itemRefs.current.get(item.title)) {
            itemRefs.current.set(item.title, ref);
          }
        }}
        onChange={({ open }) => {
          if (open) {
            // Close all other open items
            [...itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== item.title && ref) ref.close();
            });
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={() => <UnderlayLeft playlist={playlist}/>}
        snapPointsLeft={[100]}
      >
        <View style={[styles[`container${theme}`]]}>
          <TouchableOpacity onLongPress={drag} onPress={() => navigation.navigate("SongDetail", {song: item})} style={[styles.listItem,styles[`background${theme}`]]}>
          <View style={styles.containerLeftIcon}>
            <Ionicons
              name={"menu"}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
          <View style={styles.containerNumber}>
            <Text style={[styles.listItemNumber, styles[`text${theme}`]]}>
              {item.number}
            </Text>
          </View>
          <View style={styles.containerName}>
            <Text
              style={[styles.listItemName, styles[`text${theme}`]]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </View>
          <View style={styles.containerIcon}>
            <Ionicons
              name={"chevron-forward"}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
          </TouchableOpacity>
        </View>
      </SwipeableItem>
    </ScaleDecorator>
  );
}

type UnderlayLeftProps = {
  playlist: string;
}

// item on the RIGHT side
const UnderlayLeft = ({playlist}:UnderlayLeftProps) => {
  const { close, item } = useSwipeableItemParams<Item>();
  const { playlists } = React.useContext(UserContext);

  const removeSong = async () => {
    var indexP = playlists.findIndex((x) => x.title == playlist);
    if (indexP !== -1) {
      var indexS = playlists[indexP].songs.findIndex((x) => x.title == item.title);
      if (indexS !== -1) {
        playlists[indexP].songs.splice(indexS, 1);
        await storeObjectData('playlists', playlists);
      }
    }
    close()
  };

  return (
    <Animated.View style={[styles.row, styles.underlayLeft]}>
      <TouchableOpacity onPressOut={removeSong}>
        <Text style={styles.text}>Odstrániť</Text>
      </TouchableOpacity>
    </Animated.View>
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
    shadowColor: '#000',
  },
  shadowdark: {
    shadowColor: '#ffffff',
  },
  containerSh: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerSearch: {
    // width: "95 %",
    flex: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  containerSearchBar: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  itemContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
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
    height: '100%',
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 15,
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  underlayRight: {
    flex: 1,
    backgroundColor: "teal",
    justifyContent: "flex-start",
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "flex-end",
  },
  containerLeftIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  containerName: {
    flex: 6,
    justifyContent: "center",
  },
  containerNumber: {
    flex: 1,
    paddingHorizontal: 3,
  },
  listItem: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: "row",
  },
  listItemNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItemName: {
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
  backgroundlight: {
    backgroundColor: colors.light
  },
  backgrounddark: {
    backgroundColor: colors.dark
  }
});

export default PlaylistDetail;

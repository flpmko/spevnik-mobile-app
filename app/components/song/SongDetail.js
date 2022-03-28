import React, {
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view/dist/Popover';
import * as Linking from 'expo-linking';

import { ThemeContext } from '../../util/ThemeManager';
import colors from '../../config/colors';
import playlists_data from '../../data/playlists_data';
import Separator from '../list/Separator';

const SongDetail = ({ route, navigation }) => {
  const Playlists = playlists_data;
  const { theme, fontSize } = React.useContext(ThemeContext);
  const [isPopoverVisible, setisPopoverVisible] = useState(false);
  const [heartIcon, setHeartIcon] = useState('heart-outline');
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.containerItem}>
        <Text style={styles.textModal}>{item.title}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const textStyles = StyleSheet.create({
    textText: {
      fontSize: fontSize,
    },
  });

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const togglePopover = () => {
    setisPopoverVisible(!isPopoverVisible);
  };

  const handlePress = () => {
    heartIcon === 'heart-outline'
      ? setHeartIcon('ios-heart')
      : setHeartIcon('heart-outline');
  };

  const handlePresentModalPress = useCallback(() => {
    togglePopover();
    bottomSheetModalRef.current?.present();
  }, [isPopoverVisible]);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderHeaderComponent = useCallback(() => (
    <TouchableOpacity
      style={{
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'flex-end',
      }}
      onPress={handleDismissModalPress}
    >
      <Ionicons name={'close'} size={32} color={colors.light_placeholder} />
    </TouchableOpacity>
  ));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.containerAddButton}>
          <Ionicons
            name={heartIcon}
            size={28}
            color={theme === 'dark' ? colors.primarydark : colors.primary}
            onPress={handlePress}
          />
          <Popover
            isVisible={isPopoverVisible}
            onRequestClose={togglePopover}
            popoverStyle={styles.popoverStyle}
            arrowStyle={styles.arrowStyle}
            from={
              <TouchableOpacity onPress={togglePopover}>
                <Ionicons
                  name={'ellipsis-vertical'}
                  size={28}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
              </TouchableOpacity>
            }
          >
            <View>
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={handlePresentModalPress}
              >
                <Ionicons
                  name={'add'}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
                <Text style={styles.textPopup}>Pridať do playlistu</Text>
              </TouchableOpacity>
              <Separator />
              <TouchableOpacity
                style={styles.containerPopup}
                onPress={() =>
                  handleLinkPress(
                    'https://github.com/flpmko/spevnik-mobile-app'
                  )
                }
              >
                <Ionicons
                  name={'bug'}
                  size={28}
                  style={styles.iconPopup}
                  color={theme === 'dark' ? colors.primarydark : colors.primary}
                />
                <Text style={styles.textPopup}>Nahlásiť chybu</Text>
              </TouchableOpacity>
            </View>
          </Popover>
        </View>
      ),
    });
  }, [navigation, isPopoverVisible, heartIcon]);

  return (
    <SafeAreaView>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          style={[
            styles.shadow,
            styles[`container${theme}`],
            styles[`shadow${theme}`],
          ]}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
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
      <ScrollView style={[styles.container, styles[`container${theme}`]]}>
        <View style={styles.containerTitle}>
          <Text style={[styles.textTitle]}>{route.params.song?.title}</Text>
        </View>
        <View style={styles.containerCategory}>
          <Text style={[styles.textCategory, styles[`text${theme}`]]}>
            {route.params.song?.season}
          </Text>
        </View>
        <View style={styles.containerText}>
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
    display: 'flex',
    padding: 20,
    height: '100%',
  },
  containerAddButton: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
  },
  containerVerse: {
    paddingVertical: 10,
  },
  containerText: {
    display: 'flex',
    paddingTop: 30,
    paddingBottom: 100,
  },
  containerPopup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  containerContent: {
    backgroundColor: 'white',
  },
  containerItem: {
    paddingVertical: 10,
    margin: 6,
    borderRadius: 15,
    borderWidth: 0,
    backgroundColor: colors.lightgray,
  },
  containerTitle: {
    display: 'flex',
  },
  containerCategory: {
    display: 'flex',
    flexDirection: 'row',
  },
  containerlight: {
    backgroundColor: colors.light,
  },
  containerdark: {
    backgroundColor: colors.dark,
  },
  iconPopup: {
    paddingHorizontal: 10,
  },
  textPopup: {
    paddingRight: 10,
  },
  textVerse: {
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: colors.primary,
  },
  textCategory: {
    fontStyle: 'italic',
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
    shadowColor: '#000',
  },
  shadowdark: {
    shadowColor: '#ffffff',
  },
});

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { UserContext } from '../../util/UserManager';
import colors from '../../config/colors';

const ListItem = ({ item, onPress }) => {
  const { theme } = React.useContext(UserContext);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.listItem}>
        {item.number ? (
          <View style={styles.containerNumber}>
            <Text style={[styles.listItemNumber, styles[`text${theme}`]]}>
              {item.number}
            </Text>
          </View>
        ) : (
          <View style={styles.containerFill}></View>
        )}
        <View style={styles.containerName}>
          <Text
            style={[styles.listItemName, styles[`text${theme}`]]}
            numberOfLines={1}
          >
            {item?.title}
          </Text>
        </View>
        <View style={styles.containerIcon}>
          <Ionicons
            name={'chevron-forward'}
            color={theme === 'light' ? 'black' : 'white'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  containerIcon: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  containerName: {
    flex: 10,
    justifyContent: 'center',
  },
  containerNumber: {
    flex: 2,
    paddingRight: 10,
    textAlign: 'right',
  },
  containerFill: {
    paddingRight: 20,
  },
  listItem: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: 'row',
  },
  listItemNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
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
});

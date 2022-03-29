import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Popover from 'react-native-popover-view/dist/Popover';
import { Ionicons } from '@expo/vector-icons';

import { UserContext } from '../../util/UserManager';
import SongDetail from './SongDetail';
import SongsList from './SongsList';
import Separator from '../list/Separator';

import colors from '../../config/colors';

const SongsPage = ({ screenTitle, data, filters }) => {
  const { theme } = React.useContext(UserContext);
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SongsList"
        component={SongsList}
        filters={filters}
        data={data}
        initialParams={{ filters: filters, data: data }}
        options={{
          headerTitle: screenTitle,
          headerTintColor:
            theme === 'dark' ? colors.primarydark : colors.primary,
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => {
          return {
            headerTitle: route.params.song.number
              ? 'Pieseň č. ' + route.params.song.number
              : route.params.song.title,
            headerTintColor:
              theme === 'dark' ? colors.primarydark : colors.primary,
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default SongsPage;

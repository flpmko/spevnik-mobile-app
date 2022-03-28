import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeContext } from '../../util/ThemeManager';
import SongDetail from './SongDetail';
import SongsList from './SongsList';

import colors from '../../config/colors';

const SongsPage = ({ screenTitle, data, filters }) => {
  const { theme } = React.useContext(ThemeContext);
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
            headerTitle: 'Pieseň č. ' + route.params.song?.number,
            headerTintColor:
              theme === 'dark' ? colors.primarydark : colors.primary,
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default SongsPage;

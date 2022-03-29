import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { UserProvider } from './app/util/UserManager';
import Navigation from './app/util/Navigation';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <BottomSheetModalProvider>
          <Navigation />
        </BottomSheetModalProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;

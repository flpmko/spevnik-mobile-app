import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "./app/util/ThemeManager";
import Navigation from "./app/util/Navigation";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <Navigation />
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

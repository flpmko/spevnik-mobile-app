import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "./app/util/ThemeManager";
import Navigation from "./app/util/Navigation";

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}

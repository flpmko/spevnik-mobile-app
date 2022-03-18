import React, { useState } from "react";
import { Appearance } from "react-native";

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [fontSize, setFontSize] = useState(20);

  const changeFontSize = (param) => {
    if (param === "increase") {
      if (fontSize < 40) setFontSize(fontSize + 2);
    } else if (param === "decrease") {
      if (fontSize > 10) setFontSize(fontSize - 2);
    } else {
      setFontSize(20);
    }
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, fontSize, toggleTheme, changeFontSize }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

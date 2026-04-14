import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appThemes, ThemeModes } from '../config/theme';

const STORAGE_KEY = 'housekeeping_theme_mode';

const ThemeContext = createContext({
  mode: ThemeModes.DARK,
  tokens: appThemes[ThemeModes.DARK].tokens,
  paperTheme: appThemes[ThemeModes.DARK].paper,
  navigationTheme: appThemes[ThemeModes.DARK].navigation,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(ThemeModes.DARK);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMode && appThemes[storedMode]) {
          setMode(storedMode);
          return;
        }

        const systemTheme = Appearance.getColorScheme();
        setMode(systemTheme === ThemeModes.LIGHT ? ThemeModes.LIGHT : ThemeModes.DARK);
      } catch (error) {
        console.error('ThemeProvider load error:', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const next = current === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const theme = useMemo(() => ({
    tokens: appThemes[mode]?.tokens || appThemes[ThemeModes.DARK].tokens,
    paperTheme: appThemes[mode]?.paper || appThemes[ThemeModes.DARK].paper,
    navigationTheme:
      appThemes[mode]?.navigation || appThemes[ThemeModes.DARK].navigation,
  }), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      ...theme,
    }),
    [mode, toggleTheme, theme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const fonts = {
  regular: {
    fontFamily: 'Mluvka-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Mluvka-Regular',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'Mluvka-Bold',
    fontWeight: 'bold',
  },
  heavy: {
    fontFamily: 'Mluvka-Bold',
    fontWeight: '900',
  },
  displayLarge: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 57,
    fontWeight: '700',
  },
  displayMedium: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 45,
    fontWeight: '700',
  },
  displaySmall: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 36,
    fontWeight: '700',
  },
  headlineLarge: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 32,
    fontWeight: '700',
  },
  headlineMedium: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 28,
    fontWeight: '700',
  },
  headlineSmall: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 24,
    fontWeight: '700',
  },
  titleLarge: {
    fontFamily: 'Mluvka-Bold',
    fontSize: 22,
    fontWeight: '700',
  },
  titleMedium: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSmall: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 14,
    fontWeight: '600',
  },
  bodyLarge: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 12,
    fontWeight: '400',
  },
  labelLarge: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 14,
    fontWeight: '600',
  },
  labelMedium: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 12,
    fontWeight: '600',
  },
  labelSmall: {
    fontFamily: 'Mluvka-Regular',
    fontSize: 11,
    fontWeight: '600',
  },
};

const palette = {
  acaciaCottonBall: '#f3f7fd',
  acaciaCarolinaParakeet: '#d6e07e',
  acaciaEnamelledDragon: '#4bc78a',
  acaciaZucchini: '#134234',
  acaciaSatinDeepBlack: '#1c1e1f',
};

const statusPalette = {
  vacantClean: palette.acaciaEnamelledDragon,
  vacantDirty: '#f2994a',
  occupiedClean: '#2196F3',
  occupiedDirty: '#ef5350',
  inspection: '#f321c6',
};

const taskPalette = {
  pending: '#ff9800',
  started: '#2196F3',
  completed: '#4caf50',
  under_review: '#9c27b0',
  approved: '#009688',
  rejected: '#f44336',
  reassigned: '#7b1fa2',
};

const baseTokens = {
  background: palette.acaciaCottonBall,
  text: palette.acaciaSatinDeepBlack,
  border: palette.acaciaEnamelledDragon,
  heading: palette.acaciaZucchini,
  button: palette.acaciaZucchini,
  buttonText: palette.acaciaSatinDeepBlack,
  buttonHover: palette.acaciaSatinDeepBlack,
  buttonDisabled: '#888',
  block: palette.acaciaCarolinaParakeet,
  blockSecondary: palette.acaciaCottonBall,
  info: palette.acaciaEnamelledDragon,
  link: palette.acaciaEnamelledDragon,
  icon: palette.acaciaZucchini,
  surface: palette.acaciaCarolinaParakeet,
  drawer: palette.acaciaCarolinaParakeet,
  header: palette.acaciaCarolinaParakeet,
  navigation: palette.acaciaZucchini,
  toggleTrack: palette.acaciaEnamelledDragon,
  status: statusPalette,
  taskStatus: taskPalette,
  fonts: fonts,
};

const lightTokens = {
  ...baseTokens,
};

const darkTokens = {
  ...baseTokens,
  background: palette.acaciaSatinDeepBlack,
  text: palette.acaciaCottonBall,
  border: palette.acaciaEnamelledDragon,
  heading: palette.acaciaCarolinaParakeet,
  button: palette.acaciaCarolinaParakeet,
  buttonHover: palette.acaciaCottonBall,
  block: palette.acaciaZucchini,
  blockSecondary: palette.acaciaSatinDeepBlack,
  icon: palette.acaciaCarolinaParakeet,
  surface: palette.acaciaZucchini,
  drawer: palette.acaciaZucchini,
  header: palette.acaciaZucchini,
  navigation: palette.acaciaZucchini,
  toggleTrack: palette.acaciaCarolinaParakeet,
};

const lightPaperTheme = {
  ...MD3LightTheme,
  fonts: fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.acaciaZucchini,
    onPrimary: palette.acaciaCottonBall,
    secondary: palette.acaciaEnamelledDragon,
    tertiary: palette.acaciaCarolinaParakeet,
    background: lightTokens.background,
    surface: lightTokens.surface,
    text: lightTokens.text,
    placeholder: palette.acaciaSatinDeepBlack,
    outline: palette.acaciaEnamelledDragon,
    shadow: palette.acaciaZucchini,
    onSurface: palette.acaciaSatinDeepBlack,
    surfaceDisabled: palette.acaciaCottonBall,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: '#d32f2f',
    inversePrimary: palette.acaciaCarolinaParakeet,
    notification: palette.acaciaEnamelledDragon,
  },
};

const darkPaperTheme = {
  ...MD3DarkTheme,
  fonts: fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.acaciaCarolinaParakeet,
    onPrimary: palette.acaciaSatinDeepBlack,
    secondary: palette.acaciaEnamelledDragon,
    tertiary: palette.acaciaCarolinaParakeet,
    background: darkTokens.background,
    surface: darkTokens.surface,
    text: darkTokens.text,
    placeholder: palette.acaciaCottonBall,
    outline: palette.acaciaEnamelledDragon,
    shadow: palette.acaciaSatinDeepBlack,
    onSurface: palette.acaciaCottonBall,
    surfaceDisabled: palette.acaciaSatinDeepBlack,
    backdrop: 'rgba(0, 0, 0, 0.8)',
    error: '#ef5350',
    inversePrimary: palette.acaciaCarolinaParakeet,
    notification: palette.acaciaEnamelledDragon,
  },
};

const lightNavigationTheme = {
  ...NavigationDefaultTheme,
  fonts: fonts,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: palette.acaciaZucchini,
    background: lightTokens.background,
    card: lightTokens.surface,
    text: lightTokens.text,
    border: lightTokens.border,
    notification: palette.acaciaEnamelledDragon,
  },
};

const darkNavigationTheme = {
  ...NavigationDarkTheme,
  fonts: fonts,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: palette.acaciaCarolinaParakeet,
    background: darkTokens.background,
    card: darkTokens.surface,
    text: darkTokens.text,
    border: darkTokens.border,
    notification: palette.acaciaEnamelledDragon,
  },
};

export const ThemeModes = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const appFonts = fonts;

export const appThemes = {
  [ThemeModes.LIGHT]: {
    tokens: lightTokens,
    paper: lightPaperTheme,
    navigation: lightNavigationTheme,
  },
  [ThemeModes.DARK]: {
    tokens: darkTokens,
    paper: darkPaperTheme,
    navigation: darkNavigationTheme,
  },
};

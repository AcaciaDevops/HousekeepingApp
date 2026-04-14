// src/components/CustomDrawer.js
import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/acaciaLogo.svg';
import acaciaDark from '../assets/AcaciaDark.svg';
import useAuth from '../features/auth/hooks/useAuth';
import { useAppTheme } from '../context/ThemeContext';
import { ThemeModes } from '../config/theme';
import { Switch } from 'react-native-paper';

const buildStyles = (tokens) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: tokens.background,
        },
        drawerContent: {
            flex: 1,
        },
        drawerHeader: {
            backgroundColor: tokens.block,
            padding: 20,
            alignItems: 'flex-start',
            borderBottomWidth: 1,
            borderColor: tokens.border,
        },
        logoWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        drawerItems: {
            flex: 1,
        },
        drawerFooter: {
            borderTopWidth: 1,
            borderTopColor: tokens.border,
            padding: 10,
            backgroundColor: tokens.blockSecondary,
        },
        footerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 5,
        },
        footerButtonText: {
            fontSize: 14,
            color: tokens.text,
            fontWeight: 'bold',
        },
        logoImage: {
            width: 40,
            height: 40,
        },
        themeToggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: tokens.border,
        },
        themeLabel: {
            color: tokens.text,
            fontWeight: '600',
        },
    });

export default function CustomDrawer({ user, ...props }) {
  const { logout } = useAuth();
  const { tokens, mode, toggleTheme } = useAppTheme();
  const styles = useMemo(() => buildStyles(tokens), [tokens]);

  async function handleLogout() {
    await logout();
  }

  return (
      <View style={styles.container}>
          <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
              <View style={styles.drawerHeader}>
                  <View style={styles.logoWrapper}>
                      <Image
                          source={logo}
                          style={styles.logoImage}
                          resizeMode="contain"
                      />
                      <Image
                          source={acaciaDark}
                          style={styles.logoImage}
                          resizeMode="contain"
                      />
                  </View>
              </View>

              <View style={styles.drawerItems}>
                  <DrawerItemList {...props} />
              </View>
          </DrawerContentScrollView>

          <View style={styles.drawerFooter}>
              <View style={styles.themeToggleContainer}>
                  <Text style={styles.themeLabel}>Light</Text>
                  <Switch
                    value={mode === ThemeModes.DARK}
                    onValueChange={toggleTheme}
                    color={tokens.button}
                    trackColor={{ true: tokens.buttonHover, false: tokens.blockSecondary }}
                  />
                  <Text style={styles.themeLabel}>Dark</Text>
              </View>
              <TouchableOpacity
                  style={styles.footerButton}
                  onPress={handleLogout}
              >
                  <MaterialIcons name="logout" size={20} color={tokens.icon} />
                  <Text style={styles.footerButtonText}>Logout</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
}

// src/components/CustomHeader.js
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
} from 'react-native';
import NotificationBell from "../components/notifications/NotificationBell.js";
import { MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/acaciaLogo.svg';
import acaciaDark from '../assets/AcaciaDark.svg';
import acacia from '../assets/Acacia.svg';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import useAuth from '../features/auth/hooks/useAuth';
import { useAppTheme } from '../context/ThemeContext';

export default function CustomHeader({user, isExpanded, setIsExpanded, ...props }) {
     const {  logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);
  const { tokens, mode } = useAppTheme();
    const styles = useMemo(() => createStyles(tokens), [tokens]);
     
    async function handleLogout() {
        setDropdownVisible(false);
        await logout();
    }

    return (
        <View style={styles.container}>
            {console.log("mode::",mode)}
             <View style={styles.logoWrapper}>
                                 <Image
                                     source={logo}
                                     style={styles.logoImage}
                                     resizeMode="contain"
                                 />
                                 {mode == 'light' ?
                                   <Image
                                     source={acaciaDark}
                                     style={styles.acacialogoImage}
                                     resizeMode="contain"
                                 /> :  <Image
                                     source={acacia}
                                     style={styles.acacialogoImage}
                                     resizeMode="contain"
                                 /> 
                                 }
                               
                        </View>

            {/* Center: Title */}
            <View style={styles.centerContainer}>
                <Text style={styles.title}>PMS App</Text>
            </View>

            {/* Right: Notifications + Profile */}
            <View style={styles.rightContainer}>
                <NotificationBell />
                
                <TouchableOpacity
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    style={styles.userImageButton}
                >
                    {user?.profile_image ? (
                        <Image
                            source={{ uri: user.profile_image }}
                            style={styles.userImage}
                        />
                    ) : (
                        <View style={styles.userImagePlaceholder}>
                            <MaterialIcons name="person" size={24} color={tokens.button} />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Profile Dropdown Modal */}
            <Modal
                visible={dropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <View style={styles.dropdownHeader}>
                            {user?.profile_image ? (
                                <Image
                                    source={{ uri: user.profile_image }}
                                    style={styles.dropdownUserImage}
                                />
                            ) : (
                                <View style={styles.dropdownUserImagePlaceholder}>
                                    <MaterialIcons name="person" size={30} color={tokens.button} />
                                </View>
                            )}
                            <View style={styles.userInfo}>
                                <Text style={styles.userName} numberOfLines={1}>
                                    {user?.user_first_name || user?.user_email || 'User'}
                                </Text>
                                <Text style={styles.userRole}>{user?.user_role_name || 'User'}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <MaterialIcons name="logout" size={22} color={tokens.icon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const createStyles = (tokens) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            height: 60,
            backgroundColor: tokens.header,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            zIndex: 10,
        },
          logoWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
         acacialogoImage: {
            width: 70,
        },
        logoImage: {
            width: 25,
        },
        leftContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        centerContainer: {
            flex: 2,
            alignItems: 'center',
        },
        rightContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        iconButton: {
            padding: 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: tokens.heading,
        },
        userImageButton: {
            marginLeft: 4,
            padding: 4,
        },
        userImage: {
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: tokens.button,
        },
        userImagePlaceholder: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: tokens.block,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tokens.border,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        dropdown: {
            position: 'absolute',
            top: 65,
            right: 16,
            backgroundColor: tokens.surface,
            borderRadius: 12,
            width: 280,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            overflow: 'hidden',
        },
        dropdownHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: tokens.blockSecondary || tokens.surface,
        },
        dropdownUserImage: {
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 12,
        },
        dropdownUserImagePlaceholder: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: tokens.block,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        userInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        userName: {
            fontSize: 15,
            fontWeight: 'bold',
            color: tokens.text,
        },
        userRole: {
            fontSize: 12,
            color: tokens.info,
            marginTop: 1,
        },
        logoutButton: {
            padding: 8,
            backgroundColor: tokens.block,
            borderRadius: 8,
        },
    });
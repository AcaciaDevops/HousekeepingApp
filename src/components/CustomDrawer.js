// src/components/CustomDrawer.js
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Images
import { MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/acaciaLogo.svg';
import acaciaDark from '../assets/AcaciaDark.svg';
import useAuth from '../features/auth/hooks/useAuth';

export default function CustomDrawer({ user, isExpanded, setIsExpanded, ...props }) {
    const { logout } = useAuth();
    
    async function handleLogout() {
        await logout();
    }
    
    const toggleDrawer = () => {
        setIsExpanded(!isExpanded);
    };
    
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}   style={styles.drawerScrollView}>
                {/* Header Section */}
                <View style={styles.drawerHeader}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoWrapper}>
                            <Image
                                source={logo}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                            {isExpanded && (
                                <Image
                                    source={acaciaDark}
                                    style={styles.textImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    </View>
                    
                    
                </View>

                {/* Drawer Items */}
                <View style={styles.drawerItems}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            {/* Footer Section */}
            <View style={styles.drawerFooter}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={handleLogout}
                >
                    <MaterialIcons name="logout" size={20} color="#00000" />
                    {isExpanded && (
                        <Text style={styles.footerButtonText}>Logout</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
          marginTop: 50, 
    },
    drawerContent: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    userRole: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    drawerItems: {
        flex: 1,
    },
    drawerFooter: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: 10,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 5,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 14,
        color: '#00000',
        fontWeight: 'bold',
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoImage: {
        width: 40,
        height: 40,
    },
    textImage: {
        width: 100,
        height: 30,
    },
    toggleButton: {
        padding: 4,
    },
});
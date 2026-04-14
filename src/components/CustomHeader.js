// src/components/CustomHeader.js (with hamburger menu)
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import NotificationBell from "../components/notifications/NotificationBell.js";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import  useAuth  from '../features/auth/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomHeader({user, isExpanded, setIsExpanded, ...props }) {
     const {  logout } = useAuth();
    const navigation = useNavigation();
    const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDrawer = () => {
        setIsExpanded(!isExpanded);
    };
    
    async function handleLogout() {
  await logout();
}
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <TouchableOpacity
                    onPress={toggleDrawer}
                    style={styles.menuButton}
                >
                    <MaterialIcons name="menu" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.centerContainer}>
                <Text style={styles.title}>PMS App</Text>
            </View>

            <View style={styles.rightContainer}>
                  <View >
                        <NotificationBell />
                      </View>
                <TouchableOpacity
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    style={styles.userImageButton}
                >
                    {console.log("user::",user)}
                    {user?.profile_image ? (
                        <Image
                            source={{ uri: user.profile_image }}
                            style={styles.userImage}
                        />
                    ) : (
                        <View style={styles.userImagePlaceholder}>
                            <MaterialIcons name="person" size={24} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Dropdown Modal (same as before) */}
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
                                    <MaterialIcons name="person" size={30} color="#62ce99" />
                                </View>
                            )}
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user?.name || user?.user_email|| 'User'}</Text>
                                <Text style={styles.userRole}>{user?.user_role_name || 'User'}</Text>
                            </View>
                             <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={20} color="#00000" />
                        </TouchableOpacity>
                        </View>
                        
                       
                        
                        {/* <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={20} color="#00000" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity> */}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: '#1c1e1f',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
    },
    rightContainer: {
          flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
    },
    menuButton: {
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#d6e07e',
    },
    userImageButton: {
        padding: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#62ce99',
    },
    userImagePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#62ce99',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    dropdown: {
        position: 'absolute',
        top: 55,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 300,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        overflow: 'hidden',
    },
    dropdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    dropdownUserImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    dropdownUserImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#edf9f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userRole: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
  
});
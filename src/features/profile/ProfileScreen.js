import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Button,
  TextInput,
  Avatar,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import  useAuth  from '../../features/auth/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext';
import { useThemedStyles } from '../../utils/useThemedStyles';
import { ThemedScrollView } from '../../components/ui';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigation = useNavigation();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createProfileStyles);
  const [profileData, setProfileData] = useState({
    user_first_name: '',
    user_last_name: '',
    user_email: '',
    user_contact_number: '',
    user_role_name: '',
    user_profile_image_path: null,
  });

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      } else if (user) {
        console.log("user::123", user);
        setProfileData({
          user_first_name: user.user_first_name || user.name || '',
          user_last_name: user.user_last_name || '',
          user_email: user.user_email || '',
          user_contact_number: user.user_contact_number || user.phone || '',
          user_role_name: user.user_role_name || '',
          user_profile_image_path: user.user_profile_image_path || null,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };


  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 0.8,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick image');
      } else {
        setProfileData({
          ...profileData,
          avatar: response.assets[0].uri,
        });
      }
    });
  };
async function handleLogout() {
  await logout();
}
const roleLabelMap = {
  MaintenanceManager: "Maintenance Manager",
  MaintenanceStaff: "Maintenance Staff",
  HousekeepingManager: "Housekeeping Manager",
  HousekeepingStaff: "Housekeeping Staff",
};

  return (
    <ThemedScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header with Background */}
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity
          onPress={handleImagePick}
          disabled={!isEditing}
          style={styles.avatarTouchable}
          activeOpacity={0.7}
        >
          {profileData.user_profile_image_path ? (
            <Image
              source={{ uri: profileData.user_profile_image_path }}
              style={styles.profileImage}
              onError={() => {
                // Fallback to avatar if image fails to load
                setProfileData(prev => ({ ...prev, user_profile_image_path: null }));
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarLabel}>
                {profileData.user_first_name ? profileData.user_first_name.charAt(0).toUpperCase() :
                 profileData.user_email ? profileData.user_email.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.editImageBadge}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

     
      {/* Personal Information Section */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Personal Information</Title>
          </View>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Icon name="person-outline" size={20} color={tokens.icon} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="First Name"
                value={profileData.user_first_name}
                onChangeText={(text) => setProfileData({ ...profileData, user_first_name: text })}
                mode="outlined"
                style={styles.editInput}
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>{profileData.user_first_name || 'Not set'}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <Icon name="person-outline" size={20} color={tokens.icon} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Last Name"
                value={profileData.user_last_name}
                onChangeText={(text) => setProfileData({ ...profileData, user_last_name: text })}
                mode="outlined"
                style={styles.editInput}
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>{profileData.user_last_name || 'Not set'}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="mail-outline" size={20} color={tokens.icon} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Email"
                value={profileData.user_email}
                onChangeText={(text) => setProfileData({ ...profileData, user_email: text })}
                mode="outlined"
                style={styles.editInput}
                keyboardType="email-address"
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{profileData.user_email || 'Not set'}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <Icon name="call-outline" size={20} color={tokens.icon} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Phone Number"
                value={profileData.user_contact_number}
                onChangeText={(text) => setProfileData({ ...profileData, user_contact_number: text })}
                mode="outlined"
                style={styles.editInput}
                keyboardType="phone-pad"
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{profileData.user_contact_number || 'Not set'}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="briefcase-outline" size={20} color={tokens.icon} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>{roleLabelMap[profileData?.user_role_name] || "User"}</Text>
            </View>
          </View>

          {/* Edit/Save Button */}
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
              buttonColor={isEditing ? tokens.success : tokens.button}
              textColor={tokens.buttonText}
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
            {isEditing && (
              <Button
                mode="outlined"
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
                buttonColor={tokens.surface}
                textColor={tokens.text}
              >
                Cancel
              </Button>
            )}
          </View>
             
          </Card.Content>
      </Card>

      {/* Settings Section */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Settings</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
            <Icon name="notifications-outline" size={24} color={tokens.icon} />
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: tokens.border, true: tokens.button }}
            thumbColor={notifications ? tokens.button : tokens.surface}
          />
          </View>
          
       
    
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card style={styles.aboutCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>About</Title>
          <Divider style={styles.divider} />
          
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="information-circle-outline" size={24} color={tokens.icon} />
            <Text style={styles.aboutText}>App Version 1.0.0</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="document-text-outline" size={24} color={tokens.icon} />
            <Text style={styles.aboutText}>Terms & Conditions</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="shield-outline" size={24} color={tokens.icon} />
            <Text style={styles.aboutText}>Privacy Policy</Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="mail-outline" size={24} color={tokens.icon} />
            <Text style={styles.aboutText}>Support & Feedback</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        buttonColor={tokens.button}
        textColor={tokens.buttonText}
      >
        Logout
      </Button>

      <View style={styles.footer} />
    </ThemedScrollView>
  );
};

const createProfileStyles = (tokens) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: tokens.background,
      paddingBottom: 40,
    },
    header: {
      height: 100,
      backgroundColor: tokens.header,
      position: "relative",
    },
    headerOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    profileImageContainer: {
      alignItems: "center",
      marginTop: -60,
      marginBottom: 20,
    },
    avatarTouchable: {
      position: 'relative',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: tokens.background,
      elevation: 5,
      shadowColor: tokens.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      // Web-specific styles for better compatibility
      objectFit: 'cover',
    },
    profileAvatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: tokens.button,
      borderWidth: 4,
      borderColor: tokens.background,
      elevation: 5,
      shadowColor: tokens.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      // Ensure proper display on web
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarLabel: {
      fontSize: 48,
      color: tokens.buttonText,
      fontWeight: 'bold',
      // Web-specific font rendering
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      lineHeight: 48,
    },
    editImageBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: tokens.button,
      borderRadius: 20,
      padding: 8,
      borderWidth: 2,
      borderColor: tokens.background,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 12,
      color: tokens.text,
    },
    userRole: {
      fontSize: 14,
      color: tokens.info,
      marginTop: 4,
    },
    infoCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 2,
      backgroundColor: tokens.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    settingsCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 2,
      backgroundColor: tokens.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    aboutCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      elevation: 2,
      backgroundColor: tokens.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: tokens.heading,
    },
    divider: {
      marginVertical: 12,
      backgroundColor: tokens.border,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 20,
      alignItems: "flex-start",
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoLabel: {
      fontSize: 12,
      color: tokens.info,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 16,
      color: tokens.text,
      fontWeight: "500",
    },
    editInput: {
      flex: 1,
      backgroundColor: tokens.background,
      height: 40,
      color: tokens.text,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 10,
    },
    editButton: {
      flex: 1,
      marginRight: 8,
      borderRadius: 8,
    },
    cancelButton: {
      flex: 1,
      marginLeft: 8,
      borderRadius: 8,
      borderColor: tokens.border,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingLabel: {
      fontSize: 16,
      marginLeft: 12,
      color: tokens.text,
    },
    aboutItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    aboutText: {
      fontSize: 14,
      color: tokens.text,
      marginLeft: 12,
    },
    logoutButton: {
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    footer: {
      height: 20,
    },
  });

export default ProfileScreen;

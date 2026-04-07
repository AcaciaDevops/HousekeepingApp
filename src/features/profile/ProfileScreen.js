import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Avatar,
  IconButton,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
 const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    user_first_name: '',
    user_last_name:'',
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
        console.log("user::123",user)
        setProfileData({
          name: user.name || '',
          email: user.user_email || '',
          phone: user.phone || '+1 234 567 8900',
          position: user.user_role_name == 'MaintenanceManager' ? 'Maintenance Manager' : 'Maintenance Staff',
          department: 'Engineering & Maintenance',
          joinDate: 'January 2024',
          avatar: null,
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
    <ScrollView style={styles.container}>
      {/* Header with Background */}
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
       
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleImagePick} disabled={!isEditing}>
          {profileData.user_profile_image_path ? (
            <Image source={{ uri: profileData.user_profile_image_path }} style={styles.profileImage} />
          ) : (
            <Avatar.Text
              size={120}
              label={profileData.user_first_name ? profileData.user_first_name.charAt(0).toUpperCase() : 'U'}
              style={styles.profileAvatar}
              labelStyle={styles.avatarLabel}
            />
          )}
          {isEditing && (
            <View style={styles.editImageBadge}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.userName}>{profileData.user_first_name || 'User Name'}</Text>
        <Text style={styles.userRole}>
            {roleLabelMap[profileData?.user_role_name] || "User"}
          </Text>
      </View>

     
      {/* Personal Information Section */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Personal Information</Title>
          </View>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Icon name="person-outline" size={20} color="#666" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Full Name"
                value={profileData.user_first_name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                mode="outlined"
                style={styles.editInput}
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{profileData.user_first_name || 'Not set'}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="email-outline" size={20} color="#666" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Email"
                value={profileData.user_email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                mode="outlined"
                style={styles.editInput}
                keyboardType="email-address"
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{profileData.user_email}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="call-outline" size={20} color="#666" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Phone Number"
                value={profileData.user_contact_number}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                mode="outlined"
                style={styles.editInput}
                keyboardType="phone-pad"
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{profileData.user_contact_number}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="briefcase-outline" size={20} color="#666" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                label="Position"
                value={profileData.position}
                onChangeText={(text) => setProfileData({ ...profileData, position: text })}
                mode="outlined"
                style={styles.editInput}
                dense
              />
            ) : (
              <View>
                <Text style={styles.infoLabel}>Position</Text>
                <Text style={styles.infoValue}>{roleLabelMap[profileData?.user_role_name] || "User"}</Text>
              </View>
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
              <Icon name="notifications-outline" size={24} color="#666" />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#007AFF' }}
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
            <Icon name="information-circle-outline" size={24} color="#666" />
            <Text style={styles.aboutText}>App Version 1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="document-text-outline" size={24} color="#666" />
            <Text style={styles.aboutText}>Terms & Conditions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="shield-outline" size={24} color="#666" />
            <Text style={styles.aboutText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Icon name="email-outline" size={24} color="#666" />
            <Text style={styles.aboutText}>Support & Feedback</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Logout Button */}
   <Button
  mode="contained"
  onPress={handleLogout}
  style={styles.logoutButton}
  buttonColor="#FF3B30"
  icon="logout"
>
        <Icon name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        Logout
      </Button>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 150,
    backgroundColor: '#007AFF',
    position: 'relative',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
  },
  editHeaderButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileAvatar: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 5,
  },
  avatarLabel: {
    fontSize: 48,
    color: '#007AFF',
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  aboutCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editText: {
    color: '#007AFF',
    fontSize: 14,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    backgroundColor: '#fff',
    height: 40,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  footer: {
    height: 20,
  },
});

export default ProfileScreen;
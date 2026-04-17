import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthorizationHeader = async () => {
  try {
    const JWTToken = await AsyncStorage.getItem('token');
    if (!JWTToken) {
      console.error('JWT Token not found in AsyncStorage.');
      return {};
    }
    return {
      Authorization: `Bearer ${JWTToken}`
    };
  } catch (error) {
    console.error('Error retrieving JWT token:', error);
    return {};
  }
};
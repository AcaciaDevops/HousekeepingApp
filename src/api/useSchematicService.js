import axios from 'axios';
import { Platform } from 'react-native';
import { GRAPHICS_SERVICE_API_URL } from '../config/env';

// ✅ Define the specific API URL from environment variables
// For React Native (Expo), you'll need to use @env or react-native-config
// Option 1: Using react-native-dotenv (already in your package.json)

// Option 2: Using a config file approach (fallback)
const API_URL = process.env.EXPO_PUBLIC_APP_API_GRAPHICS_SERVICE_URL || '';

const normalizeGraphicsData = (flowData) => {
  if (!flowData) return flowData;

  if (
    typeof flowData === 'object' &&
    !Array.isArray(flowData) &&
    flowData.graphics_data &&
    !flowData.nodes &&
    !flowData.edges
  ) {
    return flowData.graphics_data;
  }

  return flowData;
};

// Option 3: For production, you can also get from Constants (Expo)
// import Constants from 'expo-constants';
// const API_URL = Constants.expoConfig?.extra?.API_GRAPHICS_SERVICE_URL || '';

export const saveSchematic = async (propertyId, graphicType, flowData) => {
  try {
    const graphicsData = normalizeGraphicsData(flowData);

    // ✅ Use API_URL in the request path
    const response = await axios.post(`${API_URL}`, {
      property_id: propertyId,
      graphic_type: graphicType,
      graphics_data: graphicsData
    });
    return response.data;
  } catch (error) {
    console.error('Error saving schematic:', error);
    
    // ✅ Handle React Native specific error types
    if (error.message === 'Network Error' || !error.response) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    
    throw error;
  }
};

export const getSchematic = async (propertyId, graphicType) => {
  try {
    // ✅ Use API_URL in the request path
    const response = await axios.get(`${API_URL}/${propertyId}`, {
      params: { type: graphicType }
    });
    return response.data;
  } catch (error) {
    // Check if it's a 404 (Not Found) - this is normal for new properties
    if (error.response && error.response.status === 404) {
      console.warn("No schematic found for this property (404). Starting fresh.");
      return null; 
    }
    
    // Check for Network Error
    if (!error.response) {
      console.error("Network Error: Could not connect to backend.");
      return null; 
    }

    // ✅ Handle timeout errors (React Native specific)
    if (error.message && error.message.includes('timeout')) {
      console.error("Request timeout: Backend took too long to respond.");
      return null;
    }

    console.error('Error fetching schematic:', error);
    return null;
  }
};

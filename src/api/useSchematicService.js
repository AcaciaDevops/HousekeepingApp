import axios from 'axios';
import { Platform } from 'react-native';
import { GRAPHICS_SERVICE_API_URL } from '../config/env';

const API_URL =`${GRAPHICS_SERVICE_API_URL}/graphics`;

export const saveSchematic = async (propertyId, graphicType, flowData) => {
  try {
    //  Use API_URL in the request path
    const response = await axios.post(`${API_URL}`, {
      property_id: propertyId,
      graphic_type: graphicType,
      graphics_data: flowData
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
import { useState } from 'react';
import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';

const API_URL = process.env.EXPO_PUBLIC_APP_API_PROPERTY_SERVICE_URL || 'YOUR_API_URL';
const UPDATE_ALLOWED_FIELDS = [
  'property_portfolio_id',
  'property_name',
  'property_type',
  'property_latitude',
  'property_longitude',
  'property_address',
  'property_contacts',
  'property_information',
  'property_assets',
  'property_image',
  'property_rating',
  'property_notes',
  'property_slug'
];

const toNullableNumber = (value, fieldName) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  return parsed;
};

const sanitizePropertyUpdatePayload = (payload) => {
  const source = payload && typeof payload === 'object' ? payload : {};
  const sanitized = {};

  UPDATE_ALLOWED_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      sanitized[field] = source[field];
    }
  });

  if ('property_latitude' in sanitized) {
    sanitized.property_latitude = toNullableNumber(sanitized.property_latitude, 'property_latitude');
  }

  if ('property_longitude' in sanitized) {
    sanitized.property_longitude = toNullableNumber(sanitized.property_longitude, 'property_longitude');
  }

  if ('property_rating' in sanitized) {
    sanitized.property_rating = toNullableNumber(sanitized.property_rating, 'property_rating');
  }

  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

// Helper function for JSON requests
const makeJSONRequest = async (url, options = {}) => {
  const authHeader = await getAuthorizationHeader();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.error || errorData.message || `Request failed with status ${response.status}`,
      response: { data: errorData, status: response.status }
    };
  }

  return response.json();
};

// Helper function for FormData requests (file uploads)
const makeFormDataRequest = async (url, formData, options = {}) => {
  const authHeader = await getAuthorizationHeader();
  
  const response = await fetch(url, {
    method: 'POST',
    ...options,
    headers: {
      ...authHeader,
      ...options.headers,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.error || errorData.message || `Request failed with status ${response.status}`,
      response: { data: errorData, status: response.status }
    };
  }

  return response.json();
};

const useProperty = () => {
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await makeJSONRequest(API_URL);
      const propertiesArray = Array.isArray(data) ? data : [data];
      setProperties(propertiesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertiesByPortfolio = async (portfolio_id) => {
    setLoading(true);
    try {
      const data = await makeJSONRequest(`${API_URL}/portfolio/${portfolio_id}`);
      const propertiesArray = Array.isArray(data) ? data : [data];
      setProperties(propertiesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyById = async (id) => {
    setLoading(true);
    try {
      const data = await makeJSONRequest(`${API_URL}/${id}`);
      setProperty(data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching property ${id}:`, err);
      setError(err.message || 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data) => {
    try {
      const responseData = await makeJSONRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchProperties();
      return responseData;
    } catch (err) {
      const errorInfo = err.response?.data?.error || err.message || 'Failed to create property';
      console.error('Error creating property:', err);
      setError(errorInfo);
      throw err;
    }
  };

  const updateProperty = async (id, data) => {
    try {
      const payload = sanitizePropertyUpdatePayload(data);
      const responseData = await makeJSONRequest(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      await fetchProperties();
      return responseData;
    } catch (err) {
      const errorInfo = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update property';
      console.error(`Error updating property ${id}:`, err);
      setError(errorInfo);
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      const responseData = await makeJSONRequest(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchProperties();
      return responseData;
    } catch (err) {
      const errorInfo = err.response?.data?.error || err.message || 'Failed to delete property';
      console.error(`Error deleting property ${id}:`, err);
      setError(errorInfo);
      throw err;
    }
  };

  const updatePropertyImage = async (id, formData) => {
    try {
      const responseData = await makeFormDataRequest(`${API_URL}/upload-image/${id}`, formData);
      await fetchPropertyById(id);
      return responseData;
    } catch (err) {
      console.error(`Error updating image for property ${id}:`, err);
      throw err;
    }
  };

  return {
    properties,
    property,
    loading,
    error,
    fetchProperties,
    fetchPropertiesByPortfolio,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    updatePropertyImage
  };
};

export default useProperty;
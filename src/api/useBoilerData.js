import { useState, useEffect } from 'react';
import { BOILER_SERVICE_API_URL } from '../config/env';

const DEVICE_API_URL =`${BOILER_SERVICE_API_URL}/boiler`;
const DATA_API_URL =`${BOILER_SERVICE_API_URL}/boilerData`;

// Helper function for API requests
const makeRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = {};
    }
    throw {
      message: errorData.error || errorData.message || `Request failed with status ${response.status}`,
      response: { data: errorData, status: response.status }
    };
  }

  const data = await response.json();
  return data;
};

const useBoilerData = () => {
  const [boilers, setBoilers] = useState([]);
  const [boiler, setBoiler] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoilers = async () => {
    setLoading(true);
    try {
      const response = await makeRequest(DEVICE_API_URL);
      const data = response.data || response || [];
      setBoilers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching all boilers:", err);
      setError(err.message || 'Failed to fetch boilers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBoilerById = async (id) => {
    setLoading(true);
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`);
      setBoiler(response);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching boiler ${id} by ID:`, err);
      setError(err.message || 'Failed to fetch boiler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchBoilerData = async (id) => {
    setLoading(true);
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching boiler data for ${id}:`, err);
      setError(err.message || 'Failed to fetch boiler data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBoiler = async (data) => {
    try {
      const response = await makeRequest(DEVICE_API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchBoilers();
      return response;
    } catch (err) {
      console.error("Error creating boiler:", err);
      setError(err.message || 'Failed to create boiler');
      throw err;
    }
  };

  const updateBoiler = async (id, data) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchBoilers();
      return response;
    } catch (err) {
      console.error(`Error updating boiler ${id}:`, err);
      setError(err.message || 'Failed to update boiler');
      throw err;
    }
  };

  const deleteBoiler = async (id) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchBoilers();
      return response;
    } catch (err) {
      console.error(`Error deleting boiler ${id}:`, err);
      setError(err.message || 'Failed to delete boiler');
      throw err;
    }
  };

  const toggleBoilerStatus = async (boiler_id, desiredStatus) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${boiler_id}/control`, {
        method: 'POST',
        body: JSON.stringify({ boiler_status: desiredStatus }),
      });
      await fetchBoilers();
      return response;
    } catch (err) {
      console.error(`Error toggling boiler ${boiler_id} status to ${desiredStatus}:`, err);
      setError(err.message || 'Failed to toggle boiler status');
      throw err;
    }
  };

  const fetchCarloGavazziBoilerRealtimeData = async (boiler_id, params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${boiler_id}/carlo-gavazzi-boiler-data${queryString ? `?${queryString}` : ''}`;
      const response = await makeRequest(url);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching Carlo Gavazzi Boiler real time data for boiler ${boiler_id}:`, err);
      setError(err.message || 'Failed to fetch Carlo Gavazzi Boiler real time data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoilers();
  }, []);

  return {
    boilers,
    boiler,
    loading,
    error,
    fetchBoilers,
    fetchBoilerById,
    fetchBoilerData,
    createBoiler,
    updateBoiler,
    deleteBoiler,
    setBoilers,
    toggleBoilerStatus,
    fetchCarloGavazziBoilerRealtimeData,
  };
};

export default useBoilerData;
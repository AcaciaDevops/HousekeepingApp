import { useState, useEffect } from 'react';

const DEVICE_API_URL = process.env.EXPO_PUBLIC_APP_API_WATER_PUMP_URL || 'YOUR_WATER_PUMP_API_URL';
const DATA_API_URL = process.env.EXPO_PUBLIC_APP_API_WATER_PUMP_DATA_URL || 'YOUR_WATER_PUMP_DATA_API_URL';
const LOGS_API_URL = process.env.EXPO_PUBLIC_APP_API_WATER_PUMP_LOGS_URL || 'YOUR_WATER_PUMP_LOGS_API_URL';

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

const useWaterPumpData = () => {
  const [waterPumps, setWaterPumps] = useState([]);
  const [waterPump, setWaterPump] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWaterPumps = async () => {
    setLoading(true);
    try {
      const response = await makeRequest(DEVICE_API_URL);
      const data = response.data || response || [];
      setWaterPumps(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching all water pumps:", err);
      setError(err.message || 'Failed to fetch water pumps');
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterPumpById = async (id) => {
    setLoading(true);
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`);
      setWaterPump(response);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching water pumps ${id} by ID:`, err);
      setError(err.message || 'Failed to fetch water pumps');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterPumpData = async (id) => {
    setLoading(true);
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching water pumps data for ${id}:`, err);
      setError(err.message || 'Failed to fetch water pumps data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createWaterPump = async (data) => {
    try {
      const response = await makeRequest(DEVICE_API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchWaterPumps();
      return response;
    } catch (err) {
      console.error("Error creating water pumps:", err);
      setError(err.message || 'Failed to create water pumps');
      throw err;
    }
  };

  const updateWaterPump = async (id, data) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchWaterPumps();
      return response;
    } catch (err) {
      console.error(`Error updating water pumps ${id}:`, err);
      setError(err.message || 'Failed to update water pumps');
      throw err;
    }
  };

  const deleteWaterPump = async (id) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchWaterPumps();
      return response;
    } catch (err) {
      console.error(`Error deleting water pumps ${id}:`, err);
      setError(err.message || 'Failed to delete water pumps');
      throw err;
    }
  };

  const toggleWaterPumpStatus = async (water_pump_id, desiredStatus) => {
    try {
      const response = await makeRequest(`${DEVICE_API_URL}/${water_pump_id}/control`, {
        method: 'POST',
        body: JSON.stringify({ desired_status: desiredStatus }),
      });
      await fetchWaterPumps();
      return response;
    } catch (err) {
      console.error(`Error toggling water pumps ${water_pump_id} status to ${desiredStatus}:`, err);
      setError(err.message || 'Failed to toggle water pumps status');
      throw err;
    }
  };

  const fetchCarloGavazziWaterPumpRealtimeData = async (water_pump_id, params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${water_pump_id}/carlo-gavazzi-water-pump-data${queryString ? `?${queryString}` : ''}`;
      const response = await makeRequest(url);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error fetching Carlo Gavazzi Water Pump real time data for water pump ${water_pump_id}:`, err);
      setError(err.message || 'Failed to fetch Carlo Gavazzi Water Pump real time data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterPumps();
  }, []);

  return {
    waterPumps,
    waterPump,
    loading,
    error,
    fetchWaterPumps,
    fetchWaterPumpById,
    fetchWaterPumpData,
    createWaterPump,
    updateWaterPump,
    deleteWaterPump,
    setWaterPumps,
    toggleWaterPumpStatus,
    fetchCarloGavazziWaterPumpRealtimeData,
  };
};

export default useWaterPumpData;
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SENSOR_SERVICE_API_URL } from '../config/env';

const DEVICE_API_URL =`${SENSOR_SERVICE_API_URL}/sensor`;
const DATA_API_URL =`${SENSOR_SERVICE_API_URL}/sensorData`;

const useSensorData = () => {
  const [sensors, setSensors] = useState([]);
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Optional: Function to get auth token if needed
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (err) {
      console.error('Error getting auth token:', err);
      return null;
    }
  };

  // Optional: Create axios instance with default config
  const getAxiosInstance = async () => {
    const token = await getAuthToken();
    return axios.create({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 30000, // 30 seconds timeout for mobile networks
    });
  };

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const response = await axiosInstance.get(DEVICE_API_URL);
      const data = response.data.data || response.data || [];
      setSensors(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching all sensors:", err);
      let errorMessage = 'Failed to fetch sensors';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorById = async (id) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const response = await axiosInstance.get(`${DEVICE_API_URL}/${id}`);
      setSensor(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching sensor ${id} by ID:`, err);
      let errorMessage = 'Failed to fetch sensor';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSensor = async (data) => {
    try {
      const axiosInstance = await getAxiosInstance();
      const response = await axiosInstance.post(DEVICE_API_URL, data);
      await fetchSensors();
      return response.data;
    } catch (err) {
      console.error("Error creating sensor:", err);
      let errorMessage = 'Failed to create sensor';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      throw err;
    }
  };

  const updateSensor = async (id, data) => {
    try {
      const axiosInstance = await getAxiosInstance();
      const response = await axiosInstance.put(`${DEVICE_API_URL}/${id}`, data);
      await fetchSensors();
      return response.data;
    } catch (err) {
      console.error(`Error updating sensor ${id}:`, err);
      let errorMessage = 'Failed to update sensor';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      throw err;
    }
  };

  const deleteSensor = async (id) => {
    try {
      const axiosInstance = await getAxiosInstance();
      const response = await axiosInstance.delete(`${DEVICE_API_URL}/${id}`);
      await fetchSensors();
      return response.data;
    } catch (err) {
      console.error(`Error deleting sensor ${id}:`, err);
      let errorMessage = 'Failed to delete sensor';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      throw err;
    }
  };

  const fetchPT1000RealtimeData = async (sensor_id, params = {}) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${sensor_id}/pt1000-data${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching PT1000 real-time data for sensor ${sensor_id}:`, err);
      let errorMessage = 'Failed to fetch PT1000 real-time data';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAcaciaSensorRealtimeData = async (sensor_id, params = {}) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${sensor_id}/acacia-sensor-data${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching Acacia Sensor real-time data for sensor ${sensor_id}:`, err);
      let errorMessage = 'Failed to fetch Acacia Sensor real-time data';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMilesightTRVSensorRealtimeData = async (sensor_id, params = {}) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${sensor_id}/milesight-trv-sensor-data${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching Milesight TRV Sensor real time data for sensor ${sensor_id}:`, err);
      let errorMessage = 'Failed to fetch Milesight TRV Sensor real time data';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMilesightOccupancySensorRealtimeData = async (sensor_id, params = {}) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${sensor_id}/milesight-occupancy-sensor-data${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching Milesight Occupancy Sensor real time data for sensor ${sensor_id}:`, err);
      let errorMessage = 'Failed to fetch Milesight Occupancy Sensor real time data';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMilesightPressureSensorRealtimeData = async (sensor_id, params = {}) => {
    setLoading(true);
    try {
      const axiosInstance = await getAxiosInstance();
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${sensor_id}/milesight-pressure-sensor-data${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      console.error(`Error fetching Milesight Pressure Sensor real time data for sensor ${sensor_id}:`, err);
      let errorMessage = 'Failed to fetch Milesight Pressure Sensor real time data';
      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return {
    sensors,
    sensor,
    loading,
    error,
    fetchSensors,
    fetchSensorById,
    createSensor,
    updateSensor,
    deleteSensor,
    setSensors,
    fetchPT1000RealtimeData,
    fetchAcaciaSensorRealtimeData,
    fetchMilesightTRVSensorRealtimeData,
    fetchMilesightOccupancySensorRealtimeData,
    fetchMilesightPressureSensorRealtimeData,
  };
};

export default useSensorData;
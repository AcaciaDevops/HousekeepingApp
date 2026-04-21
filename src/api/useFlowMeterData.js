import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLOW_METER_SERVICE_API_URL } from '../config/env';

const DEVICE_API_URL =`${FLOW_METER_SERVICE_API_URL}/flowmeter`;
const DATA_API_URL =`${FLOW_METER_SERVICE_API_URL}/flowmeterData`;
const TARIFF_API_URL = `${FLOW_METER_SERVICE_API_URL}/flowmeterTariff`;


// Custom fetch implementation for React Native
const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

const useFlowMeterData = () => {
  const [flowMeters, setFlowMeters] = useState([]);
  const [flowMeter, setFlowMeter] = useState(null);

  const [tariffs, setTariffs] = useState([]);
  const [currentTariff, setCurrentTariff] = useState(null);

  const [readings, setReadings] = useState([]);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [readingsError, setReadingsError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlowMeters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(DEVICE_API_URL);
      const data = response.data || response;
      setFlowMeters(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching flow meters:", err);
      setError(err.message || 'Failed to fetch flow meters');
      setFlowMeters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFlowMeterById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${DEVICE_API_URL}/${id}`);
      setFlowMeter(response);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch flow meter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlowMeter = useCallback(async (data) => {
    try {
      const response = await fetchWithTimeout(DEVICE_API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchFlowMeters();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create flow meter');
      throw err;
    }
  }, [fetchFlowMeters]);

  const updateFlowMeter = useCallback(async (id, data) => {
    try {
      const response = await fetchWithTimeout(`${DEVICE_API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchFlowMeters();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update flow meter');
      throw err;
    }
  }, [fetchFlowMeters]);

  const deleteFlowMeter = useCallback(async (id) => {
    try {
      const response = await fetchWithTimeout(`${DEVICE_API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchFlowMeters();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete flow meter');
      throw err;
    }
  }, [fetchFlowMeters]);

  const fetchFlowMeterTariffs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(TARIFF_API_URL);
      const data = Array.isArray(response) ? response : (response.data || []);
      setTariffs(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Failed to fetch flow meter tariffs", err);
      setError(err.message || 'Failed to fetch flow meter tariffs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFlowMeterTariffById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${TARIFF_API_URL}/${id}`);
      setCurrentTariff(response);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch tariff');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlowMeterTariff = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(TARIFF_API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchFlowMeterTariffs();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create tariff');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlowMeterTariffs]);

  const updateFlowMeterTariff = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${TARIFF_API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchFlowMeterTariffs();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update tariff');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlowMeterTariffs]);

  const deleteFlowMeterTariff = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetchWithTimeout(`${TARIFF_API_URL}/${id}`, {
        method: 'DELETE',
      });
      await fetchFlowMeterTariffs();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete tariff');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlowMeterTariffs]);

  const getColdWaterConsumptionAndCost = useCallback(async ({ waterMeterIds, startDate, endDate }) => {
    if (!waterMeterIds?.length || !startDate || !endDate) {
      throw new Error('waterMeterIds, startDate, and endDate are required');
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(`${DATA_API_URL}/cold-water-consumption-cost`, {
        method: 'POST',
        body: JSON.stringify({ waterMeterIds, startDate, endDate }),
      });
      return response;
    } catch (err) {
      console.error('Failed to fetch consumption and cost', err);
      setError(err.message || 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHotWaterConsumptionAndCost = useCallback(async ({ waterMeterIds, startDate, endDate }) => {
    if (!waterMeterIds?.length || !startDate || !endDate) {
      throw new Error('waterMeterIds, startDate, and endDate are required');
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(`${DATA_API_URL}/hot-water-consumption-cost`, {
        method: 'POST',
        body: JSON.stringify({ waterMeterIds, startDate, endDate }),
      });
      return response;
    } catch (err) {
      console.error('Failed to fetch consumption and cost', err);
      setError(err.message || 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGasConsumptionAndCost = useCallback(async ({ pulseMeterIds, startDate, endDate }) => {
    if (!pulseMeterIds?.length || !startDate || !endDate) {
      throw new Error('pulseMeterIds, startDate, and endDate are required');
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(`${DATA_API_URL}/gas-consumption-cost`, {
        method: 'POST',
        body: JSON.stringify({ pulseMeterIds, startDate, endDate }),
      });
      return response;
    } catch (err) {
      console.error('Failed to fetch consumption and cost', err);
      setError(err.message || 'Failed to fetch data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMilesightWaterMeterRealtimeData = useCallback(async (meterId, params = {}) => {
    if (!meterId) return [];
    
    setLoadingReadings(true);
    setReadingsError(null);

    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${meterId}/milesight-water-meter-data${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetchWithTimeout(url);
      const dataArray = Array.isArray(response) ? response : (response.data || []);
      
      setReadings(dataArray);
      return dataArray;
    } catch (err) {
      console.error(`Error fetching water meter data for ${meterId}:`, err);
      setReadingsError(err.message || 'Failed to fetch water meter readings');
      return [];
    } finally {
      setLoadingReadings(false);
    }
  }, []);

  const fetchMilesightPulseMeterRealtimeData = useCallback(async (meterId, params = {}) => {
    if (!meterId) return [];

    setLoadingReadings(true);
    setReadingsError(null);

    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${DATA_API_URL}/${meterId}/milesight-pulse-meter-data${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetchWithTimeout(url);
      const dataArray = Array.isArray(response) ? response : (response.data || []);

      setReadings(dataArray);
      return dataArray;
    } catch (err) {
      console.error(`Error fetching pulse meter data for ${meterId}:`, err);
      setReadingsError(err.message || 'Failed to fetch pulse meter readings');
      return [];
    } finally {
      setLoadingReadings(false);
    }
  }, []);

  // Cache data for offline support
  const cacheFlowMeters = useCallback(async () => {
    try {
      await AsyncStorage.setItem('cached_flow_meters', JSON.stringify(flowMeters));
    } catch (err) {
      console.error('Failed to cache flow meters:', err);
    }
  }, [flowMeters]);

  const loadCachedFlowMeters = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem('cached_flow_meters');
      if (cached) {
        setFlowMeters(JSON.parse(cached));
      }
    } catch (err) {
      console.error('Failed to load cached flow meters:', err);
    }
  }, []);

  useEffect(() => {
    fetchFlowMeters();
    fetchFlowMeterTariffs();
    loadCachedFlowMeters();
  }, [fetchFlowMeters, fetchFlowMeterTariffs, loadCachedFlowMeters]);

  useEffect(() => {
    if (flowMeters.length > 0) {
      cacheFlowMeters();
    }
  }, [flowMeters, cacheFlowMeters]);

  return {
    // Flow meters
    flowMeters,
    flowMeter,
    fetchFlowMeters,
    fetchFlowMeterById,
    createFlowMeter,
    updateFlowMeter,
    deleteFlowMeter,
    setFlowMeters,

    // Tariffs
    tariffs,
    currentTariff,
    fetchFlowMeterTariffs,
    fetchFlowMeterTariffById,
    createFlowMeterTariff,
    updateFlowMeterTariff,
    deleteFlowMeterTariff,

    // Consumption and cost
    getColdWaterConsumptionAndCost,
    getHotWaterConsumptionAndCost,
    getGasConsumptionAndCost,
    
    // Real-time data
    fetchMilesightWaterMeterRealtimeData,
    fetchMilesightPulseMeterRealtimeData,

    // State
    readings,
    loadingReadings,
    readingsError,
    loading,
    error,
    
    // Utility
    loadCachedFlowMeters,
  };
};

export default useFlowMeterData;
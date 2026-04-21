import { useEffect, useMemo } from 'react';
import { useActivePropertyContext } from '../contexts/ActivePropertyContext.js';
// import useFloorRoomAreaSelection from '../hooks/global/useFloorRoomAreaSelection';
import useBoilerData from '../../api/useBoilerData.js';
import useWaterPumpData from '../../api/useWaterPumpData.js';
import useSensorData from '../../api/useSensorData.js';
import useFlowMeterData from '../../api/useFlowMeterData.js';

export function usePlantRoomData() {
  const { activeProperty } = useActivePropertyContext();
  const availableRooms = Array.isArray(activeProperty?.availableRooms)
    ? activeProperty.availableRooms
    : Array.isArray(activeProperty?.rooms)
      ? activeProperty.rooms
      : Array.isArray(activeProperty?.property_rooms)
        ? activeProperty.property_rooms
        : [];

  const { boilers: realBoilers = [], fetchBoilers, toggleBoilerStatus } = useBoilerData() || {};
  const { waterPumps: realWaterPumps = [], fetchWaterPumps, toggleWaterPumpStatus } = useWaterPumpData() || {};
  const { sensors: realSensors = [], fetchSensors } = useSensorData() || {};
  const { flowMeters: realFlowMeters = [], fetchFlowMeters } = useFlowMeterData() || {};

  useEffect(() => {
    const fetchData = () => {
      if (fetchBoilers) fetchBoilers();
      if (fetchWaterPumps) fetchWaterPumps();
      if (fetchSensors) fetchSensors();
      if (fetchFlowMeters) fetchFlowMeters();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const realData = useMemo(() => {
    const roomIds = Array.isArray(availableRooms) && availableRooms.length
      ? availableRooms.map((r) => r.room_id)
      : null;

    const safeBoilers = realBoilers || [];
    const safeWaterPumps = realWaterPumps || [];
    const safeSensors = realSensors || [];
    const safeFlowMeters = realFlowMeters || [];

    const roomSensors = roomIds
      ? safeSensors.filter((s) => roomIds.includes(s.sensor_room_id))
      : safeSensors;

    return {
      boilerList: safeBoilers
        .filter((b) => !roomIds || roomIds.includes(b.boiler_room_id))
        .map((b) => ({
          id: b.boiler_id,
          status: b.boiler_status,
          name: b.boiler_name,
          brand: b.boiler_brand,
          model: b.boiler_model
        })),

      waterPumpList: safeWaterPumps
        .filter((wp) => !roomIds || roomIds.includes(wp.water_pump_room_id))
        .map((wp) => ({
          id: wp.water_pump_id,
          status: wp.water_pump_status,
          name: wp.water_pump_name,
          brand: wp.water_pump_brand,
          model: wp.water_pump_model
        })),

      pt1000Sensors: roomSensors
        .filter((s) => ['PT1000', 'AcaciaSensor'].includes(s.sensor_type))
        .map((s) => ({
          id: s.sensor_id,
          value: s.temperature ?? 'N/A',
          name: s.sensor_name,
          brand: s.sensor_brand,
          model: s.sensor_model
        })),

      pressureSensors: roomSensors
        .filter((s) => ['MilesightPressureSensor', 'PressureSensor'].includes(s.sensor_type))
        .map((s) => ({
          id: s.sensor_id,
          value: s.pressure ?? s.temperature ?? 'N/A',
          name: s.sensor_name,
          brand: s.sensor_brand,
          model: s.sensor_model
        })),

      flowMeterList: safeFlowMeters.map((f) => ({
        id: f.flow_meter_id,
        value: f.flow_meter_flow_rate || '0',
        name: f.flow_meter_name,
        brand: f.flow_meter_brand,
        model: f.flow_meter_model
      })),

      valveList: [],
      tankList: [],
      thermalMeterList: [],
      switchList: []
    };
  }, [realBoilers, realWaterPumps, realSensors, realFlowMeters, availableRooms]);

  const propertyPrefix = activeProperty?.property_name?.replace(/\s+/g, '');

  // In React Native, you'll need to require images dynamically or use a different approach
  // Option 1: Using require with template strings (requires all images to be known at build time)
  // Option 2: Using { uri: 'file://path/to/image' } for local files
  // Option 3: Using network URLs if images are hosted remotely
  
  // For React Native, it's better to use an image mapping object
  const getPlantRoomGraphic = () => {
    if (!propertyPrefix) return null;
    // This approach requires you to import all possible images or use a different strategy
    // Example: return require(`../assets/images/PlantRooms/${propertyPrefix}PlantRoom.png`);
    return `/src/assets/images/PlantRooms/${propertyPrefix}PlantRoom.png`; // This won't work in RN
  };

  return {
    ...realData,
    toggleBoilerStatus,
    toggleWaterPumpStatus,
    plantRoomGraphic: `/src/assets/images/PlantRooms/${propertyPrefix}PlantRoom.png`, // Won't work in RN directly
    hotWaterGraphic: `/src/assets/images/PlantRooms/${propertyPrefix}HotWater.png` // Won't work in RN directly
  };
}

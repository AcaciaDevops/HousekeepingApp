// src/api/roomApi.js
import axios from "axios";
import { ROOM_SERVICE_API_URL } from '../config/env';


export async function fetchRooms() {
  try {
    const response = await axios.get(`${ROOM_SERVICE_API_URL}/room`);
    console.log("Fetched rooms:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function fetchTotalRooms() {
  try {
    const response = await axios.get(`${ROOM_SERVICE_API_URL}/room/total-rooms`);
    console.log("Fetched rooms:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function fetchTotalVacantCleanRooms() {
  try {
    const response = await axios.get(`${ROOM_SERVICE_API_URL}/room/total-rooms/vacant-clean`);
    console.log("Fetched rooms:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function fetchTotalVacantDirtyRooms() {
  try {
    const response = await axios.get(`${ROOM_SERVICE_API_URL}/room/total-rooms/vacant-dirty`);
    console.log("Fetched rooms:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function fetchTotalInspectionRooms() {
  try {
    const response = await axios.get(`${ROOM_SERVICE_API_URL}/room/total-rooms/inspection`);
    console.log("Fetched rooms:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function updateRoomStatus(id, room_status) {
  try {
    console.log("api triggered:",id,room_status)
    const response = await axios.put(`${ROOM_SERVICE_API_URL}/room/${id}`, { room_status });
    return response.data;
  } catch (error) {
    console.error("Error updating room status:", error);
    throw error;
  }
}

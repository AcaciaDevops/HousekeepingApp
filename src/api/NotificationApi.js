import axios from "axios";
import { NOTIFICATION_SERVICE_API_URL } from '../config/env';

export async function fetchUnReadNotifications(userid) {
  try {
    const response = await axios.get(`${NOTIFICATION_SERVICE_API_URL}/${userid}/unread`);
    console.log("Fetched notifications:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function markReadNotifications(id) {
  try {
    const response = await axios.patch(`${NOTIFICATION_SERVICE_API_URL}/${id}/mark-read`);
    console.log("Fetched notifications:", response.data);
    return response.data; // assuming backend returns array of tasks
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}
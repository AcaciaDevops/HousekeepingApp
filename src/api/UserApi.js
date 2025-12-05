// src/api/userApi.js.js
import axios from "axios";
import { USER_SERVICE_API_URL } from '../config/env';


export async function fetchUserbyRole(role_name) {
    
  try {
     let url = `${USER_SERVICE_API_URL}/user`;
      console.log("url",url,"role_name : ",role_name)
    // If not "all", append task_status filter
    if (role_name) {
      url += `/${role_name}`;
    } 
        console.log("USER_SERVICE_API_URL",url)
    const response = await axios.get(url);
    console.log("Fetched users:", response.data);
    return response.data; // assuming backend returns array of users
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
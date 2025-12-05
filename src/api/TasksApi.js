// src/api/tasksApi.js
import axios from "axios";
import { TASK_SERVICE_API_URL } from '../config/env';


export async function fetchTasks(status = "all", user) {
  try {
    const { user_role_name, user_id } = user;

    let url = `${TASK_SERVICE_API_URL}/task-assignments?`;

    // =============================
    // ⭐ ROLE-BASED FILTERING (FRONTEND)
    // =============================

    if (user_role_name === "HousekeepingManager") {
      url += "task_type=housekeeping";
    }

    if (user_role_name === "HousekeepingStaff") {
      url += `task_type=housekeeping&assigned_to=${user_id}`;
    }

    if (user_role_name === "MaintenanceManager") {
      url += "task_type=maintenance";
    }

    if (user_role_name === "MaintenanceStaff") {
      url += `task_type=maintenance&assigned_to=${user_id}`;
    }

    // =============================
    // ⭐ ADD STATUS FILTER IF NOT "all"
    // =============================

    if (status !== "all") {
      url += `&task_status=${status}`;
    }

    console.log("Final URL:", url);

    const response = await axios.get(url);
    return response.data;

  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function fetchTaskInfo(room_id) {
  console.log("room_id",room_id)
  try {
     let url = `${TASK_SERVICE_API_URL}/task-assignments`;
console.log("url",url)
    // If not "all", append task_status filter
    if (room_id) {
      url += `?room_id=${room_id}`;
    }
   console.log("url",url)
   const response = await axios.get(url);
    console.log("Fetched tasks:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function fetchAllTasks(task_type) {
  try {
     let url = `${TASK_SERVICE_API_URL}/task-items`;
     console.log("url",url)
    // If not "all", append task_status filter
    if (task_type) {
      url += `?task_type=${task_type}`;
    } 
    console.log("url",url,"status: ",task_type)
   const response = await axios.get(url);
    console.log("Fetched tasks list:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function assignTasks(assign_task_data) {
  console.log("assign task : in api : ", assign_task_data )
  try {
     let url = `${TASK_SERVICE_API_URL}/task-assignments`;
    
   const response = await axios.post(url,assign_task_data);
    console.log("assigned tasks:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error assigning tasks:", error);
    throw error;
  }
}
export async function fetchTotalProgressTaskRooms() {
  let url = `${TASK_SERVICE_API_URL}/task-assignments/in-progress`
    console.log("progress task: ,url",url)
  try {
    
    const response = await axios.get(url);
    console.log("fetch progress task:",response)
    return response.data;
  } catch (error) {
    console.error("Error ProgressTask  task:", error);
    throw error;
  }
}
export async function fetchTotalPendingTaskRooms() {
  let url = `${TASK_SERVICE_API_URL}/task-assignments/pending`
    console.log("progress task: ,url",url)
  try {
    
    const response = await axios.get(url);
    console.log("fetch progress task:",response)
    return response.data;
  } catch (error) {
    console.error("Error ProgressTask  task:", error);
    throw error;
  }
}

export async function updateTaskStatus(taskId, status) {
  try {
    const response = await axios.patch(`${TASK_SERVICE_API_URL}/task-assignments/${taskId}/status`, { status });
    console.log("taskstatus url:: ",`${TASK_SERVICE_API_URL}/task-assignments/${taskId}/status`,status)
    // http://localhost:3004/api/task-assignments/2/status
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}
export async function createTask(create_task_data) {
  console.log("create_task_data : in api : ", create_task_data )
  try {
     let url = `${TASK_SERVICE_API_URL}/task-items`;
    
   const response = await axios.post(url,create_task_data);
    console.log("create_task_data tasks:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error create_task_data tasks:", error);
    throw error;
  }
}
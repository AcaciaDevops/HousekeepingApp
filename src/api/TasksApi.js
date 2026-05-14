// src/api/tasksApi.js
import axios from "axios";
import { TASK_SERVICE_API_URL } from '../config/env';
import { NOTIFICATION_SERVICE_API_URL  } from '../config/env';

 

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
export async function fetchAllTasks({task_type,assigned_to}) {
  console.log("assigned_to::123",assigned_to)
  try {
     let url = `${TASK_SERVICE_API_URL}/task-items`;
     console.log("url",url)
    // If not "all", append task_status filter
    if (task_type) {
      url += `?task_type=${task_type}`;
    } 
     if (assigned_to) {
      url += `?assigned_to=${assigned_to}`;
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
    //   =========================
    // ASSIGN TASK NOTIFICATION
    // =========================
    await axios.post(
      `${NOTIFICATION_SERVICE_API_URL}/notifications`,
      {
        notifications_property_id: assign_task_data.task_id || "NEW_TASK",
        notifications_status: "assigned",
        notifications_category: assign_task_data.task_type,
        notifications_text: `Task: ${assign_task_data.task_name} : ${assign_task_data.task_id} is assigned to ${assign_task_data.assigned_to_email} : ${assign_task_data.assigned_to} by ${assign_task_data.assigned_by_email} : ${assign_task_data.assigned_by} `,
        notifications_value: assign_task_data.task_name || "Task",
        notifications_metric: "Task Assign",
        notifications_is_read: false
      }
    );
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

export async function updateTaskStatus(taskId, status, task_type, task_name) {
  try {
    const response = await axios.patch(`${TASK_SERVICE_API_URL}/task-assignments/${taskId}/status`, { status, task_type });
    console.log("taskstatus url:: ",`${TASK_SERVICE_API_URL}/task-assignments/${taskId}/status`,status)
    // http://localhost:3004/api/task-assignments/2/status
     // =========================
    // 2. CREATE NOTIFICATION
    // =========================
    await axios.post(
      `${NOTIFICATION_SERVICE_API_URL}/notifications`,
      {
        notifications_property_id: taskId,
        notifications_status: status,
        notifications_category: task_type,
        notifications_text: `Task ${taskId} : ${task_name} status updated to ${status}`,
        notifications_value: status,
        notifications_metric: "Task Status",
        notifications_is_read: false
      }
    );


    
    console.log("Notification created successfully");
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

    // =========================
    // CREATE NOTIFICATION
    // =========================
    await axios.post(
      `${NOTIFICATION_SERVICE_API_URL}/notifications`,
      {
        notifications_property_id: response.data.task_id || "NEW_TASK",
        notifications_status: "created",
        notifications_category: create_task_data.task_type,
        notifications_text: `New ${create_task_data.task_type} : ${create_task_data.task_name} task created by ${create_task_data.task_created_by_email} ID: ${create_task_data.task_created_by}`,
        notifications_value: create_task_data.task_name || "Task",
        notifications_metric: "Task Creation",
        notifications_is_read: false
      }
    );

    console.log("Task creation notification added");
    return response.data;
  } catch (error) {
    console.error("Error create_task_data tasks:", error);
    throw error;
  }
}

export async function fetchTotalCountTaskByStaff(assigned_to) {
  const url = `${TASK_SERVICE_API_URL}/task-assignments/tasks/counts/staff/${assigned_to}`;

  console.log("progress task url:", url);

  try {
    const response = await axios.get(url);

    console.log("TotalTask::1", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching progress task:", error);
    throw error;
  }
}
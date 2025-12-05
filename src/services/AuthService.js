import axios from "axios";
import { AUTH_SERVICE_API_URL } from '../config/env';
// Replace this with your real backend URL or move to a config file
const BASE_URL = "http://192.168.1.109:3000";

export async function login({ user_email, user_password }) {
    console.log("AuthService login called with:", { user_email, user_password,AUTH_SERVICE_API_URL });
  const url = `${AUTH_SERVICE_API_URL}/authentication/login`;
  console.log("AuthService login URL:", url);
  const resp = await axios.post(url, { user_email, user_password });
  console.log("AuthService login response:", resp);
  return resp.data; // expecting { token, user } or similar
}

export default { login };

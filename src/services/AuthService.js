import axios from "axios";
import { AUTH_SERVICE_API_URL } from '../config/env';
// Replace this with your real backend URL or move to a config file
const BASE_URL = "http://192.168.1.109:3000";

// export async function login({ user_email, user_password }) {
//     console.log("AuthService login called with:", { user_email, user_password,AUTH_SERVICE_API_URL });
//   const url = `${AUTH_SERVICE_API_URL}/authentication/login`;
//   console.log("AuthService login URL:", url);
//   const resp = await axios.post(url, { user_email, user_password });
//   console.log("AuthService login response:", resp);
//   return resp.data; // expecting { token, user } or similar
// }
// src/services/AuthService.js
async function login(credentials) {
    try {
        console.log("📡 Calling login API for:", credentials.user_email);
        
        const response = await fetch('http://192.168.1.111:3000/api/authentication/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: credentials.user_email,
                user_password: credentials.user_password
            }),
        });
        
        console.log("📡 Response status:", response.status);
        
        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            console.log("❌ API Error:", response.status, errorText);
          
            // Return error object instead of throwing
            return {
                success: false,
                error: `Server error: ${response.status}`,
                message: `Invalid email or password. Please try again.`,
                token: null
            };
        }
        
        const data = await response.json();
        console.log("✅ API Response:", data);
        
        // Check if we got a token
        if (data && data.token) {
            return {
                success: true,
                token: data.token,
                user: data.user || null,
                message: "Login successful"
            };
        } else {
            return {
                success: false,
                error: "No token received from server",
                message: data.message || "Invalid response from server",
                token: null
            };
        }
    } catch (error) {
        console.log("❌ API call error:", error);
        return {
            success: false,
            error: error.message,
            message: error.message,
            token: null
        };
    }
}

export { login };


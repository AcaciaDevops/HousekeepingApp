// utils/jwt.js
import jwtDecode from "jwt-decode";

export function decodeToken(token) {
    console.log("Decoding token:", token);
  try {
    return jwtDecode(token);
  } catch (err) {
    console.log("Failed to decode token:", err);
    return null;
  }
}

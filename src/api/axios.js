import axios from 'axios';

// During development, Vite's proxy will handle requests to '/api'.
// For production, we'll use the full URL from the environment variable.
// Note: Your .env file uses VITE_API_BASE_URL, so we're using that here.
const API_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  // This check makes the app fail loudly if the environment variable is missing.
  // It's much better to see a clear error than to have the app silently
  // try to connect to an incorrect URL.
  throw new Error("VITE_API_BASE_URL is not defined for production. Please set it in your .env file or hosting environment.");
}

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Sends paste content to the backend API to create a new paste.
 * @param {object} pasteData The paste data, including content, ttl_seconds, and max_views.
 * @returns {Promise<object>} The server response (e.g., { id, url }) on success.
 */
export const createPaste = async (pasteData) => {
  // The HomePage component already has a robust try/catch block that handles Axios errors.
  const response = await apiClient.post('/pastes', pasteData);
  return response.data;
};

/**
 * Fetches a paste from the backend API by its ID.
 * @param {string} pasteId The ID of the paste to fetch.
 * @returns {Promise<object>} The server response (e.g., { content, expires_at }) on success.
 */
export const getPaste = async (pasteId) => {
  const response = await apiClient.get(`/pastes/${pasteId}`);
  return response.data;
};
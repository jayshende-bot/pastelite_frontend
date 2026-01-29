import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
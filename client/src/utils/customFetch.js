import axios from 'axios'

// Use environment variable for API base URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const customFetch = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with cross-origin requests
})

export default customFetch

import axios from 'axios';

// The base URL should point to your Laravel backend (e.g. http://localhost:8000)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for Sanctum cookies to be sent along with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Add a response interceptor to standardize error throwing
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || error.message || 'An error occurred';
      return Promise.reject(new ApiError(status, message, data));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new ApiError(0, 'No response from server. Please check your network connection.', null));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new ApiError(0, error.message, null));
    }
  }
);

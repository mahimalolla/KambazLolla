import axios from "axios";

const axiosWithCredentials = axios.create({ 
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
axiosWithCredentials.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosWithCredentials.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url, error.message);
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('CORS')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid username or password.');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid request.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
);

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

// Debug: Log the server URL
console.log('REMOTE_SERVER:', REMOTE_SERVER);
console.log('USERS_API:', USERS_API);

export const signin = async (credentials: any) => {
  try {
    console.log('Attempting signin with:', credentials.username);
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    console.log('Signin successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Signin failed:', error);
    throw error;
  }
};

export const signup = async (user: any) => {
  try {
    console.log('Attempting signup for user:', user.username);
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    console.log('Signup successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Signup failed:', error);
    throw error;
  }
};

export const profile = async () => {
  try {
    console.log('Fetching user profile...');
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    console.log('Profile fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile fetch failed:', error);
    throw error;
  }
};

export const signout = async () => {
  try {
    console.log('Attempting signout...');
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    console.log('Signout successful');
    return response.data;
  } catch (error: any) {
    console.error('Signout failed:', error);
    throw error;
  }
};

// Find user's enrolled courses
export const findMyCourses = async () => {
  try {
    console.log('Fetching user courses...');
    const response = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
    console.log('Courses fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    return []; // Return empty array instead of throwing
  }
};

// Update user profile
export const updateProfile = async (userId: string, userUpdates: any) => {
  try {
    console.log('Updating user profile:', userId);
    const response = await axiosWithCredentials.put(`${USERS_API}/${userId}`, userUpdates);
    console.log('Profile updated:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

// Get all users (admin/faculty only)
export const findAllUsers = async () => {
  try {
    console.log('Fetching all users...');
    const response = await axiosWithCredentials.get(`${USERS_API}`);
    console.log('All users fetched:', response.data?.length || 0, 'users');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch all users:', error);
    throw error;
  }
};

// Test server connection
export const testConnection = async () => {
  try {
    console.log('Testing server connection...');
    const response = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/test`);
    console.log('Server connection successful');
    return true;
  } catch (error: any) {
    console.error('Server connection failed:', error);
    return false;
  }
};

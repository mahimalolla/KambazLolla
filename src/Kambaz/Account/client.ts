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

// FIXED: Change from POST to POST (your backend expects POST)
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

// FIXED: Updated endpoint to match your backend
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

// NEW: Find user by ID (6.2.6.4)
export const findUserById = async (userId: string) => {
  try {
    console.log('Fetching user by ID:', userId);
    const response = await axiosWithCredentials.get(`${USERS_API}/${userId}`);
    console.log('User fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user by ID:', error);
    throw error;
  }
};

// NEW: Find users by role (6.2.6.3)
export const findUsersByRole = async (role: string) => {
  try {
    console.log('Fetching users by role:', role);
    const response = await axiosWithCredentials.get(`${USERS_API}?role=${role}`);
    console.log('Users by role fetched:', response.data?.length || 0, 'users');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch users by role:', error);
    throw error;
  }
};

// NEW: Find users by partial name (6.2.6.3)
export const findUsersByPartialName = async (name: string) => {
  try {
    console.log('Fetching users by name:', name);
    const response = await axiosWithCredentials.get(`${USERS_API}?name=${name}`);
    console.log('Users by name fetched:', response.data?.length || 0, 'users');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch users by name:', error);
    throw error;
  }
};

// NEW: Delete user (6.2.6.5)
export const deleteUser = async (userId: string) => {
  try {
    console.log('Deleting user:', userId);
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
    console.log('User deleted successfully');
    return response.data;
  } catch (error: any) {
    console.error('Delete user failed:', error);
    throw error;
  }
};

// NEW: Create user (6.2.6.7) 
export const createUser = async (user: any) => {
  try {
    console.log('Creating user:', user.username);
    const response = await axiosWithCredentials.post(`${USERS_API}`, user);
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create user failed:', error);
    throw error;
  }
};

// Enrollment functions
export const findCoursesForUser = async (userId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user courses:', error);
    return [];
  }
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to enroll in course:', error);
    throw error;
  }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to unenroll from course:', error);
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

import axios from "axios";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Add request interceptor for better error handling
axiosWithCredentials.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
axiosWithCredentials.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - user may need to sign in');
    }
    return Promise.reject(error);
  }
);

// ============ COURSE FUNCTIONS ============

// Get all courses for browsing/enrollment
export const findAllCourses = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses`);
    return data || [];
  } catch (error) {
    console.error('Error fetching all courses:', error);
    throw new Error('Failed to fetch courses. Please try again.');
  }
};

// Get course by ID
export const findCourseById = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course details.');
  }
};

// Create a new course (Faculty only)
export const createCourse = async (courseData: any) => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/courses`, courseData);
    return data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Failed to create course. Please check your permissions.');
  }
};

// Update a course (Faculty only)
export const updateCourse = async (courseId: string, courseData: any) => {
  try {
    const { data } = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/courses/${courseId}`, courseData);
    return data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Failed to update course.');
  }
};

// Delete a course (Faculty only)
export const deleteCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course.');
  }
};

// ============ MODULE FUNCTIONS ============

// Get modules for a course
export const findModulesForCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/modules`);
    return data || [];
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

// Create module for a course
export const createModuleForCourse = async (courseId: string, moduleData: any) => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/courses/${courseId}/modules`, moduleData);
    return data;
  } catch (error) {
    console.error('Error creating module:', error);
    throw new Error('Failed to create module.');
  }
};

// Get users enrolled in a course
export const findUsersForCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/users`);
    return data || [];
  } catch (error) {
    console.error('Error fetching course users:', error);
    return [];
  }
};

// ============ USER FUNCTIONS (FIXED ENDPOINTS) ============

// Get current user's profile - FIXED: Your backend expects POST to /profile
export const getCurrentUser = async () => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/users/profile`);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // User not authenticated
    }
    console.error('Error fetching current user:', error);
    return null;
  }
};

// In Courses/client.ts, update findMyCourses:
export const findMyCourses = async () => {
  try {
    console.log('Making request to:', `${REMOTE_SERVER}/api/users/current/courses`);
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/current/courses`);
    console.log('findMyCourses response:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching user courses:', error);
    if (error.response?.status === 401) {
      return []; // User not authenticated
    }
    return []; // Return empty array instead of throwing for better UX
  }
};

// Get courses by specific user ID (for admin/faculty) - FIXED
export const findCoursesByUserId = async (userId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${userId}/courses`);
    return data || [];
  } catch (error) {
    console.error('Error fetching user courses:', error);
    throw new Error('Failed to fetch user courses.');
  }
};

// ============ ENROLLMENT FUNCTIONS (FIXED) ============

// Enroll in a course - FIXED: Updated to match your backend
export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'You may already be enrolled in this course.');
    } else if (error.response?.status === 404) {
      throw new Error('Course not found or no longer available.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to enroll in this course.');
    }
    
    throw new Error('Failed to enroll in course. Please try again.');
  }
};

// Unenroll from a course - FIXED
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Enrollment not found or already removed.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to unenroll from this course.');
    }
    
    throw new Error('Failed to drop course. Please try again.');
  }
};

// ============ ENROLLMENT CLIENT (using your existing enrollment API) ============

// Get all enrollments
export const findAllEnrollments = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/enrollments`);
    return data || [];
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
};

// Get enrollments for a user
export const findEnrollmentsForUser = async (userId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/enrollments/user/${userId}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return [];
  }
};

// Get enrollments for a course
export const findEnrollmentsForCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/enrollments/course/${courseId}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return [];
  }
};

// Check enrollment status
export const checkEnrollmentStatus = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/enrollments/check/${userId}/${courseId}`);
    return data.isEnrolled || false;
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
};

// ============ UTILITY FUNCTIONS ============

// Check if server is reachable - FIXED: Use existing test endpoint
export const checkServerHealth = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/test`);
    return data.message === 'API is working!';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Get all users (for admin)
export const findAllUsers = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users`);
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ============ ASSIGNMENT FUNCTIONS ============

// Get assignments for a course
export const findAssignmentsForCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/assignments`);
    return data || [];
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
};

// ============ QUIZ FUNCTIONS ============

// Get quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/quizzes`);
    return data || [];
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

// ============ MODULE CLIENT FUNCTIONS (ADD THESE) ============

// Update module
export const updateModule = async (moduleId: string, moduleData: any) => {
  try {
    const { data } = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/modules/${moduleId}`, moduleData);
    return data;
  } catch (error) {
    console.error('Error updating module:', error);
    throw new Error('Failed to update module.');
  }
};

// Delete module
export const deleteModule = async (moduleId: string) => {
  try {
    const { data } = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/modules/${moduleId}`);
    return data;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw new Error('Failed to delete module.');
  }
};

// ============ DEFAULT EXPORT ============

const courseClient = {
  // Course functions
  findAllCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Module functions
  findModulesForCourse,
  createModuleForCourse,
  findUsersForCourse,
  
  // User functions
  getCurrentUser,
  findMyCourses,
  findCoursesByUserId,
  findAllUsers,
  
  // Enrollment functions
  enrollInCourse,
  unenrollFromCourse,
  checkEnrollmentStatus,
  findAllEnrollments,
  findEnrollmentsForUser,
  findEnrollmentsForCourse,
  updateModule,
  deleteModule,
  
  // Assignment and Quiz functions
  findAssignmentsForCourse,
  findQuizzesForCourse,
  
  // Utility functions
  checkServerHealth

};

export default courseClient;

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
      // Handle unauthorized access
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

// ============ USER FUNCTIONS ============

// Get current user's profile
export const getCurrentUser = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/profile`);
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // User not authenticated
    }
    console.error('Error fetching current user:', error);
    throw new Error('Failed to fetch user profile.');
  }
};

// Get user's enrolled courses
export const findMyCourses = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/courses`);
    return data || [];
  } catch (error) {
    if (error.response?.status === 401) {
      return []; // User not authenticated
    }
    console.error('Error fetching user courses:', error);
    return []; // Return empty array instead of throwing for better UX
  }
};

// Get courses by specific user ID (for admin/faculty)
export const findCoursesByUserId = async (userId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${userId}/courses`);
    return data || [];
  } catch (error) {
    console.error('Error fetching user courses:', error);
    throw new Error('Failed to fetch user courses.');
  }
};

// ============ ENROLLMENT FUNCTIONS ============

// Enroll in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    
    // Handle specific error cases
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

// Unenroll from a course  
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Enrollment not found or already removed.');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to unenroll from this course.');
    }
    
    throw new Error('Failed to drop course. Please try again.');
  }
};

// Check if user is enrolled in a specific course
export const checkEnrollmentStatus = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}/status`);
    return data.enrolled || false;
  } catch (error) {
    if (error.response?.status === 404) {
      return false; // Not enrolled
    }
    console.error('Error checking enrollment status:', error);
    return false;
  }
};

// Get enrollment details for a specific course
export const getEnrollmentDetails = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}/details`);
    return data;
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    return null;
  }
};

// ============ STATISTICS FUNCTIONS ============

// Get user's enrollment statistics
export const getUserEnrollmentStats = async (userId?: string) => {
  try {
    const endpoint = userId 
      ? `${REMOTE_SERVER}/api/users/${userId}/stats`
      : `${REMOTE_SERVER}/api/users/stats`;
    
    const { data } = await axiosWithCredentials.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    return {
      totalEnrollments: 0,
      activeEnrollments: 0,
      completedEnrollments: 0,
      droppedEnrollments: 0,
      totalAssignmentsCompleted: 0,
      totalAssignmentsAvailable: 0
    };
  }
};

// Get course enrollment statistics (for faculty)
export const getCourseEnrollmentStats = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/stats`);
    return data;
  } catch (error) {
    console.error('Error fetching course stats:', error);
    return {
      totalStudents: 0,
      activeStudents: 0,
      averageProgress: 0
    };
  }
};

// ============ BULK OPERATIONS ============

// Bulk enroll users in a course (Faculty/Admin only)
export const bulkEnrollUsers = async (userIds: string[], courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/courses/${courseId}/bulk-enroll`, {
      userIds
    });
    return data;
  } catch (error) {
    console.error('Error bulk enrolling users:', error);
    throw new Error('Failed to enroll users. Please check your permissions.');
  }
};

// Get students enrolled in a course (Faculty only)
export const getCourseStudents = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/students`);
    return data || [];
  } catch (error) {
    console.error('Error fetching course students:', error);
    throw new Error('Failed to fetch course students.');
  }
};

// ============ SEARCH & FILTER FUNCTIONS ============

// Search courses by keyword
export const searchCourses = async (keyword: string, filters?: any) => {
  try {
    const params = new URLSearchParams();
    params.append('q', keyword);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }
    
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/search?${params}`);
    return data || [];
  } catch (error) {
    console.error('Error searching courses:', error);
    return [];
  }
};

// Get available courses for a user (courses they're not enrolled in)
export const getAvailableCoursesForUser = async (userId?: string) => {
  try {
    const endpoint = userId 
      ? `${REMOTE_SERVER}/api/users/${userId}/available-courses`
      : `${REMOTE_SERVER}/api/users/available-courses`;
    
    const { data } = await axiosWithCredentials.get(endpoint);
    return data || [];
  } catch (error) {
    console.error('Error fetching available courses:', error);
    return [];
  }
};

// ============ UTILITY FUNCTIONS ============

// Check if server is reachable
export const checkServerHealth = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/health`);
    return data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Export enrollment data (for reports)
export const exportEnrollmentData = async (courseId?: string) => {
  try {
    const endpoint = courseId 
      ? `${REMOTE_SERVER}/api/enrollments/export?courseId=${courseId}`
      : `${REMOTE_SERVER}/api/enrollments/export`;
    
    const { data } = await axiosWithCredentials.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error exporting enrollment data:', error);
    throw new Error('Failed to export enrollment data.');
  }
};

// Get enrollment history for a user
export const getEnrollmentHistory = async (userId?: string) => {
  try {
    const endpoint = userId 
      ? `${REMOTE_SERVER}/api/users/${userId}/enrollment-history`
      : `${REMOTE_SERVER}/api/users/enrollment-history`;
    
    const { data } = await axiosWithCredentials.get(endpoint);
    return data || [];
  } catch (error) {
    console.error('Error fetching enrollment history:', error);
    return [];
  }
};

// Update enrollment progress/grade (Faculty only)
export const updateEnrollmentProgress = async (userId: string, courseId: string, progressData: any) => {
  try {
    const { data } = await axiosWithCredentials.put(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}/progress`, progressData);
    return data;
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    throw new Error('Failed to update enrollment progress.');
  }
};

// ============ VALIDATION FUNCTIONS ============

// Validate course enrollment eligibility
export const validateEnrollmentEligibility = async (userId: string, courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}/eligibility`);
    return data;
  } catch (error) {
    console.error('Error validating enrollment eligibility:', error);
    return { eligible: false, reason: 'Unable to validate eligibility' };
  }
};

// Check course capacity and availability
export const checkCourseAvailability = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses/${courseId}/availability`);
    return data;
  } catch (error) {
    console.error('Error checking course availability:', error);
    return { available: false, reason: 'Unable to check availability' };
  }
};

// ============ DEFAULT EXPORT (OPTIONAL) ============

const enrollmentClient = {
  // Course functions
  findAllCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
  
  // User functions
  getCurrentUser,
  findMyCourses,
  findCoursesByUserId,
  
  // Enrollment functions
  enrollInCourse,
  unenrollFromCourse,
  checkEnrollmentStatus,
  getEnrollmentDetails,
  
  // Statistics
  getUserEnrollmentStats,
  getCourseEnrollmentStats,
  
  // Bulk operations
  bulkEnrollUsers,
  getCourseStudents,
  
  // Utility functions
  getAvailableCoursesForUser,
  checkServerHealth,
  exportEnrollmentData,
  getEnrollmentHistory,
  updateEnrollmentProgress,
  validateEnrollmentEligibility,
  checkCourseAvailability
};

export default enrollmentClient;

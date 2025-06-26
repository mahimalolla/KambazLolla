import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || "https://kambaz-node.onrender.com";

// Configure axios with default settings
const api = axios.create({
  baseURL: REMOTE_SERVER,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable credentials for CORS
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('💥 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      error: error.response?.data || error.message,
      fullError: error
    });
    
    // Better error messages for common issues
    if (error.response?.status === 404) {
      const errorMsg = `Resource not found (404): ${error.config?.url}`;
      console.error('🔍 404 Details:', errorMsg);
      error.message = errorMsg;
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.code === 'NETWORK_ERROR') {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// ================================
// QUIZ CRUD OPERATIONS
// ================================

export const findQuizzesByCourse = async (courseId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes for course:', courseId, error);
    throw error;
  }
};

export const findQuizById = async (courseId: string, quizId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', { courseId, quizId }, error);
    throw error;
  }
};

export const createQuiz = async (courseId: string, quiz: any) => {
  try {
    const response = await api.post(`/api/courses/${courseId}/quizzes`, quiz);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const updateQuiz = async (courseId: string, quizId: string, quizData: any) => {
  try {
    console.log('🔄 Updating quiz via client:', { courseId, quizId, quizData });
    const response = await api.put(`/api/courses/${courseId}/quizzes/${quizId}`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', { courseId, quizId }, error);
    throw error;
  }
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  try {
    const response = await api.delete(`/api/courses/${courseId}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

export const publishQuiz = async (courseId: string, quizId: string, published: boolean) => {
  try {
    console.log('🚀 Publishing quiz via client:', { courseId, quizId, published });
    const response = await api.patch(`/api/courses/${courseId}/quizzes/${quizId}/publish`, { published });
    return response.data;
  } catch (error) {
    console.error('Error publishing quiz:', error);
    throw error;
  }
};

// ================================
// QUESTION OPERATIONS
// ================================

export const addQuestion = async (courseId: string, quizId: string, questionData: any) => {
  try {
    const response = await api.post(`/api/courses/${courseId}/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (courseId: string, quizId: string, questionId: string, questionData: any) => {
  try {
    const response = await api.put(`/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (courseId: string, quizId: string, questionId: string) => {
  try {
    const response = await api.delete(`/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// ================================
// QUIZ ATTEMPTS
// ================================

export const submitQuizAttempt = async (courseId: string, quizId: string, attemptData: any) => {
  try {
    const response = await api.post(`/api/courses/${courseId}/quizzes/${quizId}/attempts`, attemptData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};

export const getUserAttempts = async (courseId: string, quizId: string, userId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/attempts/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    throw error;
  }
};

export const getAllAttempts = async (courseId: string, quizId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/attempts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all attempts:', error);
    throw error;
  }
};

export const getQuizStats = async (courseId: string, quizId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    throw error;
  }
};

// ================================
// DEBUG/TEST FUNCTIONS
// ================================

export const testQuizAPI = async () => {
  try {
    const response = await api.get('/api/quizzes/test');
    return response.data;
  } catch (error) {
    console.error('Quiz API test failed:', error);
    throw error;
  }
};

export const testQuizExists = async (courseId: string, quizId: string) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/test`);
    return response.data;
  } catch (error) {
    console.error('Quiz existence test failed:', error);
    throw error;
  }
};

export const testDatabaseConnection = async () => {
  try {
    const response = await api.get('/api/debug/database');
    return response.data;
  } catch (error) {
    console.error('Database test failed:', error);
    throw error;
  }
};

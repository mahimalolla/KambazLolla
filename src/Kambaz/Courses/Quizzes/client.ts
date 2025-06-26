import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || "https://kambaz-node.onrender.com";
const QUIZZES_API = `${REMOTE_SERVER}/api/courses`;

// Configure axios with default settings
const api = axios.create({
  baseURL: REMOTE_SERVER,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('💥 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
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
      error: error.response?.data || error.message
    });
    return Promise.reject(error);
  }
);

// ================================
// QUIZ CRUD OPERATIONS
// ================================

export const findQuizzesByCourse = async (courseId: string) => {
  const response = await api.get(`/api/courses/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (courseId: string, quizId: string) => {
  const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await api.post(`/api/courses/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (courseId: string, quizId: string, quizData: any) => {
  const response = await api.put(`/api/courses/${courseId}/quizzes/${quizId}`, quizData);
  return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const response = await api.delete(`/api/courses/${courseId}/quizzes/${quizId}`);
  return response.data;
};

export const publishQuiz = async (courseId: string, quizId: string, published: boolean) => {
  const response = await api.patch(`/api/courses/${courseId}/quizzes/${quizId}/publish`, { published });
  return response.data;
};

// ================================
// QUESTION OPERATIONS
// ================================

export const addQuestion = async (courseId: string, quizId: string, questionData: any) => {
  const response = await api.post(`/api/courses/${courseId}/quizzes/${quizId}/questions`, questionData);
  return response.data;
};

export const updateQuestion = async (courseId: string, quizId: string, questionId: string, questionData: any) => {
  const response = await api.put(`/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`, questionData);
  return response.data;
};

export const deleteQuestion = async (courseId: string, quizId: string, questionId: string) => {
  const response = await api.delete(`/api/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`);
  return response.data;
};

// ================================
// QUIZ ATTEMPTS
// ================================

export const submitQuizAttempt = async (courseId: string, quizId: string, attemptData: any) => {
  const response = await api.post(`/api/courses/${courseId}/quizzes/${quizId}/attempts`, attemptData);
  return response.data;
};

export const getUserAttempts = async (courseId: string, quizId: string, userId: string) => {
  const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/attempts/${userId}`);
  return response.data;
};

export const getAllAttempts = async (courseId: string, quizId: string) => {
  const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/attempts`);
  return response.data;
};

export const getQuizStats = async (courseId: string, quizId: string) => {
  const response = await api.get(`/api/courses/${courseId}/quizzes/${quizId}/stats`);
  return response.data;
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

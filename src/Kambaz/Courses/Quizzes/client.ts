import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || "https://kambaz-node.onrender.com";
const QUIZZES_API = `${REMOTE_SERVER}/api/courses`;

// ================================
// QUIZ CRUD OPERATIONS
// ================================

export const findQuizzesByCourse = async (courseId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (courseId: string, quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes/${quizId}`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${QUIZZES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (courseId: string, quizId: string, quiz: any) => {
  const response = await axios.put(`${QUIZZES_API}/${courseId}/quizzes/${quizId}`, quiz);
  return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${courseId}/quizzes/${quizId}`);
  return response.data;
};

export const publishQuiz = async (courseId: string, quizId: string, published: boolean) => {
  const response = await axios.patch(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/publish`, {
    published
  });
  return response.data;
};

// ================================
// QUESTION OPERATIONS
// ================================

export const addQuestionToQuiz = async (courseId: string, quizId: string, question: any) => {
  const response = await axios.post(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestion = async (courseId: string, quizId: string, questionId: string, question: any) => {
  const response = await axios.put(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/questions/${questionId}`, question);
  return response.data;
};

export const deleteQuestion = async (courseId: string, quizId: string, questionId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/questions/${questionId}`);
  return response.data;
};

// ================================
// QUIZ ATTEMPT OPERATIONS
// ================================

export const submitQuizAttempt = async (courseId: string, quizId: string, attempt: any) => {
  const response = await axios.post(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/attempts`, attempt);
  return response.data;
};

export const findAttemptsByQuizAndUser = async (courseId: string, quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/attempts/${userId}`);
  return response.data;
};

export const findAllAttemptsByQuiz = async (courseId: string, quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/attempts`);
  return response.data;
};

export const getQuizStats = async (courseId: string, quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes/${quizId}/stats`);
  return response.data;
};

// ================================
// HELPER FUNCTIONS
// ================================

// Test function to verify API connection
export const testQuizAPI = async () => {
  try {
    const response = await axios.get(`${REMOTE_SERVER}/api/quizzes/test`);
    return response.data;
  } catch (error) {
    console.error('Quiz API test failed:', error);
    throw error;
  }
};

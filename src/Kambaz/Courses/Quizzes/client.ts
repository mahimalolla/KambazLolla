import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER || "https://kambaz-node.onrender.com";
const QUIZZES_API = `${REMOTE_SERVER}/api/courses`;

export const findQuizzesByCourse = async (courseId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${QUIZZES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const testQuizAPI = async () => {
  try {
    const response = await axios.get(`${REMOTE_SERVER}/api/quizzes/test`);
    return response.data;
  } catch (error) {
    console.error('Quiz API test failed:', error);
    throw error;
  }
};

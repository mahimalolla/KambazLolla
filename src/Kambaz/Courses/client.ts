import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });

// Get all courses for browsing/enrollment
export const findAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${REMOTE_SERVER}/api/courses`);
  return data;
};

// Enroll in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
  return data;
};

// Unenroll from a course  
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.delete(`${REMOTE_SERVER}/api/users/${userId}/courses/${courseId}`);
  return data;
};

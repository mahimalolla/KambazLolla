import courses from "./courses.json";
import modules from "./modules.json"; 
import assignments from "./assignments.json";

export const users = [
  {
    _id: "121",
    username: "alice_johnson",
    password: "password123",
    firstName: "Alice",
    lastName: "Johnson", 
    email: "alice.johnson@example.com",
    dob: "1985-08-15",
    role: "FACULTY"
  },
  {
    _id: "122",
    username: "bob_smith", 
    password: "password123",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@example.com",
    dob: "1999-03-22", 
    role: "STUDENT"
  },
  {
    _id: "123",
    username: "charlie_wilson",
    password: "password123",
    firstName: "Charlie", 
    lastName: "Wilson",
    email: "charlie.wilson@example.com",
    dob: "1988-11-05",
    role: "FACULTY"
  },
  {
    _id: "124", 
    username: "diana_prince",
    password: "password123",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.prince@example.com",
    dob: "2000-07-12",
    role: "STUDENT"
  }
];

export const enrollments = [
  { _id: "1", user: "122", course: "RS101" }, // Bob enrolled in React
  { _id: "2", user: "122", course: "RS102" }, // Bob enrolled in Node  
  { _id: "3", user: "124", course: "RS101" }, // Diana enrolled in React
  { _id: "4", user: "124", course: "RS103" }, // Diana enrolled in Database
  { _id: "5", user: "121", course: "RS101" }, // Alice teaches React
  { _id: "6", user: "121", course: "RS102" }, // Alice teaches Node
  { _id: "7", user: "121", course: "RS103" }, // Alice teaches Database
  { _id: "8", user: "123", course: "RS101" }, // Charlie teaches React
  { _id: "9", user: "123", course: "RS102" }  // Charlie teaches Node
];

export { courses, modules, assignments };

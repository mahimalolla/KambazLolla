export default [
  {
    _id: "M101",
    name: "Introduction to React",
    description: "Basic React concepts and JSX",
    course: "RS101",
    lessons: [
      {
        _id: "L101",
        name: "Getting started with React",
        description: "Introduction to React and Create React App",
        module: "M101"
      },
      {
        _id: "L102", 
        name: "JSX and Components",
        description: "Learn JSX syntax and React components",
        module: "M101"
      }
    ]
  },
  {
    _id: "M102",
    name: "React State and Props",
    description: "Managing component state and props",
    course: "RS101",
    lessons: [
      {
        _id: "L201",
        name: "Understanding State",
        description: "Component state management",
        module: "M102"
      },
      {
        _id: "L202",
        name: "Props and Data Flow", 
        description: "Passing data between components",
        module: "M102"
      }
    ]
  },
  {
    _id: "M201",
    name: "Node.js Fundamentals",
    description: "Introduction to Node.js and server-side JavaScript",
    course: "RS102",
    lessons: [
      {
        _id: "L301",
        name: "Getting Started with Node",
        description: "Setting up Node.js development environment",
        module: "M201"
      }
    ]
  },
  {
    _id: "M301",
    name: "Database Design Principles",
    description: "Fundamentals of relational database design",
    course: "RS103",
    lessons: [
      {
        _id: "L401",
        name: "Entity Relationship Modeling",
        description: "Creating ER diagrams and database schemas",
        module: "M301"
      }
    ]
  }
];

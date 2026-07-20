import { IDepartment } from "./interface";

export const departments: IDepartment[] = [
  {
    id: "comp-sci",
    name: "Computer Science",
    courses: [
      {
        id: "CS101",
        courseCode: "CS101",
        title: "Introduction to Programming",
        department: "Computer Science",
        credits: 3,
        semester: 1,
        level: 1,
        description: "Learn the fundamentals of programming using Python.",
        lecturers: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
          },
        ],
        courseSchedules: [
          { day: "Monday", time: "10:00 AM - 12:00 PM", venue: "Room 101" },
          {
            day: "Wednesday",
            time: "10:00 AM - 12:00 PM",
            venue: "Room 101",
          },
        ],
        progress: 65,
        status: "active",
      },
      {
        id: "CS201",
        courseCode: "CS201",
        title: "Data Structures",
        department: "Computer Science",
        credits: 3,
        semester: 1,
        level: 2,
        prerequisite: ["CS101"],
        description: "Advanced data structures and algorithms.",
        lecturers: [
          {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
          },
        ],
        status: "available",
      },
      {
        id: "CS301",
        courseCode: "CS301",
        title: "Database Systems",
        department: "Computer Science",
        credits: 3,
        semester: 1,
        level: 3,
        prerequisite: ["CS201"],
        description: "Introduction to database design and SQL.",
        status: "active",
      },
    ],
  },
  {
    id: "math",
    name: "Mathematics",
    courses: [
      {
        id: "MATH101",
        courseCode: "MATH101",
        title: "Calculus I",
        department: "Mathematics",
        credits: 4,
        semester: 1,
        level: 1,
        description: "Limits, derivatives, and integrals.",
        status: "registered",
        lecturers: [
          {
            id: "3",
            firstName: "Robert",
            lastName: "Johnson",
          },
        ],
        progress: 30,
      },
    ],
  },
];

import { IStepItem } from "./interface";

export const LECTURER_STEPS: IStepItem[] = [
  {
    id: 1,
    title: "Uploads & sells eBooks",
    roleSubtitle: "Platform Administrator",
    descriptions: [
      "Manages user accounts and permissions.",
      "Reviews and approves uploaded eBooks.",
      "Handles platform policies, compliance, and moderation.",
      "Oversees system performance and security.",
    ],
    highlightText: "Lecturers uploads and sells their eBooks online",
    imageUrl: "/assets/lecturer-1.png",
    imageAlt: "Tablet showing online eBooks",
  },
  {
    id: 2,
    title: "Creates exams",
    descriptions: [
      "Manages exam scheduling, formatting, and distribution.",
      "Handles secure storage and release of exam papers.",
      "Coordinates invigilation and submission logistics.",
    ],
    highlightText: "Lecturers creates exams online",
    imageUrl: "/assets/lecturer-2.png",
    imageAlt: "Students taking computer based exam",
  },
  {
    id: 3,
    title: "View sales, results and analytics",
    roleSubtitle: "Lecturer / Content Creator (Access)",
    descriptions: [
      "Views: See how many students viewed their eBooks/exams.",
      "Sales: Track purchases and revenue.",
      "Results: View student scores and performance.",
      "Analytics: Engagement trends, top-performing content.",
    ],
    highlightText: "Lecturers views sales, results and analytics online",
    imageUrl: "/assets/lecturer-3.png",
    imageAlt: "Analytics dashboard on tablet",
  },
];

export const STUDENT_STEPS: IStepItem[] = [
  {
    id: 1,
    title: "Purchases eBooks",
    roleSubtitle: "Browse & Discover",
    descriptions: [
      "• Search for available eBooks by course, lecturer, subject, or institution.",
      "• View previews, descriptions, and pricing before purchase.",
    ],
    highlightText: "Student Purchases eBooks online",
    imageUrl: "/assets/student-1.png",
    imageAlt: "300,000 eBooks with PLR & MRR",
  },
  {
    id: 2,
    title: "Registers for exams",
    descriptions: [
      "Create and manage their account.",
      "Browse available exams by course, lecturer, or institution.",
      "View exam details (date, time, duration, rules, and fee if applicable).",
      "Register for an exam with one click.",
    ],
    highlightText: "Student Registers for exams online",
    imageUrl: "/assets/student-2.png",
    imageAlt: "Students registering and taking exams in computer lab",
  },
  {
    id: 3,
    title: "Takes exam in a secure browser",
    descriptions: [
      "Secure browser runs checks:",
      "Blocks screen recording, screenshots, copy/paste, exams.",
      "Disables other apps, tabs, and background processes.",
      "Confirms webcam, microphone, and network stability (if required).",
    ],
    highlightText: "Student Takes an exam in secure browser",
    imageUrl: "/assets/student-3.png",
    imageAlt: "Why Secure Online Exam Platforms",
  },
];

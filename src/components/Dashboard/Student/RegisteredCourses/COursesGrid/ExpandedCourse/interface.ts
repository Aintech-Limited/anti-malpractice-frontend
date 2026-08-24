import { RegisteredCourse } from "../../interface";

export interface IExpandedCourseProps {
  course: RegisteredCourse;
  handleViewMaterials: (course: RegisteredCourse) => void;
}

import { ICourse, TCourseStatus } from "../interface";

export interface IStatusButtonProps {
  course: ICourse;
  status: TCourseStatus;
  isRegistering?: boolean;
  onCourseSelect: (course: ICourse, action?: any) => void;
  onRegister: (course: ICourse) => void;
}

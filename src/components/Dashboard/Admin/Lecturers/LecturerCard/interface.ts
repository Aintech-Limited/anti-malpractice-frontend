import { ILecturer } from "../interface";

export interface ILecturerCardProps {
  lecturer: ILecturer;
  onReviewDocuments: (lecturer: ILecturer) => void;
  onAssignCourse: (lecturer: ILecturer) => void;
  onManageAssignments: (lecturer: ILecturer) => void;
}

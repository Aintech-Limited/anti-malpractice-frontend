import { ILecturerAssignment } from "../interface";

export interface IViewLecturersModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onUnassign?: (assignmentId: string) => Promise<void>;
  onReassign?: (assignment: ILecturerAssignment) => void;
}

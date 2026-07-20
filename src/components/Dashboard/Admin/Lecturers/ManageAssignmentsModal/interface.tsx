import { ILecturerAssignment } from "../interface";

export interface IManageAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturerId: string;
  lecturerName: string;
  onUnassign?: (assignmentId: string) => Promise<void>;
  onReassign?: (assignment: ILecturerAssignment) => void;
}

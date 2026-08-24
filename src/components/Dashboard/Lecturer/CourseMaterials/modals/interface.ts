import { IAssignedCourse, ICourseMaterial } from "../interface";

export interface ICreateMaterialModalProps {
  courses: IAssignedCourse[];
  onClose: () => void;
  onSuccess: (material: any) => void;
}

export interface IEditMaterialModalProps {
  material: ICourseMaterial;
  onClose: () => void;
  onSuccess: (updatedMaterial: ICourseMaterial) => void;
}
export interface IDeleteMaterialModalProps {
  material: ICourseMaterial;
  onClose: () => void;
  onSuccess: () => void;
}
export interface IViewMaterialModalProps {
  material: ICourseMaterial;
  onClose: () => void;
  onPreviewPDF: (pdfUrl: string) => void;
}

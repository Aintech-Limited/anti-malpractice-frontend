export interface IGradeInputProps {
  answerId: string;
  studentName: string;
  answerText: string;
  maxMarks: number;
  initialMarks?: number | null;
  onGradeChange: (answerId: string, marks: number) => void;
}

import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import { IExamsListProps } from "./interface";
import { ExamCard } from "../ExamCard/ExamCard";

export const ExamsList = ({
  exams,
  onViewQuestions,
  onAddQuestions,
  onUpdate,
  onDelete,
  onViewRegistrations,
}: IExamsListProps) => {
  if (exams.length === 0) {
    return (
      <EmptyState
        title="No exams found"
        description="Create your first exam to get started"
        icon="clipboard"
        action={{
          label: "Create Exam",
          onClick: () => {},
          variant: "primary",
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          onViewQuestions={onViewQuestions}
          onAddQuestions={onAddQuestions}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onViewRegistrations={onViewRegistrations}
        />
      ))}
    </div>
  );
};

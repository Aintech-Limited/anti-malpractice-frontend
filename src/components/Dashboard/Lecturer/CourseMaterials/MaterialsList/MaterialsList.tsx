import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import { MaterialCard } from "../MaterialCard/MaterialCard";
import { IMaterialsListProps } from "./interface";

export const MaterialsList = ({
  materials,
  onView,
  onEdit,
  onDelete,
}: IMaterialsListProps) => {
  if (!materials || materials?.length === 0) {
    return (
      <EmptyState
        title="No materials found"
        description="Upload your first course material to get started"
        icon="file"
        action={{
          label: "Upload Material",
          onClick: () => {},
          variant: "primary",
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {materials?.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

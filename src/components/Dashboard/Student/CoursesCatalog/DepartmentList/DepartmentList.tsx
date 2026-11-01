import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import { DepartmentItem } from "../DepartmentItem/DepartmentItem";
import { IDepartmentListProps } from "./interface";
import { NoCourses } from "@/src/components/common/EmptyState/EmptyState.stories";

export const DepartmentList = ({
  departments,
  expandedDepartments,
  expandedCourses,
  getCourseStatus,
  isRegistering = false,
  onToggleDepartment,
  onToggleCourseDetails,
  onCourseSelect,
  onRegister,
  onClearFilters,
}: IDepartmentListProps) => {
  if (departments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <EmptyState
          title={NoCourses.args!.title!}
          description={NoCourses.args!.description}
          icon={NoCourses.args!.icon}
          action={{
            label: "Clear Filters",
            onClick: () => {
              // Clear all filters
              // window.location.reload();
              onClearFilters?.();
            },
            variant: "outline",
          }}
          size="lg"
          bordered
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {departments.map((department) => (
        <DepartmentItem
          key={department.id}
          department={department}
          isExpanded={expandedDepartments.has(department.id)}
          expandedCourses={expandedCourses}
          getCourseStatus={getCourseStatus}
          isRegistering={isRegistering}
          onToggleDepartment={() => onToggleDepartment(department.id)}
          onToggleCourseDetails={onToggleCourseDetails}
          onCourseSelect={onCourseSelect}
          onRegister={onRegister}
        />
      ))}
    </div>
  );
};

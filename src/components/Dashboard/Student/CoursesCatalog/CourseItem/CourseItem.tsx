import { getStatusColor } from "@/src/lib/helper";
import { CourseHeader } from "../CourseHeader/CourseHeader";
import { ICourseItemProps } from "./interface";
import { CourseDetails } from "../CourseDetails/CourseDetails";

export const CourseItem = ({
  course,
  status,
  isExpanded,
  isRegistering = false,
  onToggleDetails,
  onCourseSelect,
  onRegister,
}: ICourseItemProps) => {
  return (
    <div className={`p-4 transition-colors ${getStatusColor(status)}`}>
      <CourseHeader
        course={course}
        status={status}
        isExpanded={isExpanded}
        isRegistering={isRegistering}
        onToggleDetails={onToggleDetails}
        onCourseSelect={onCourseSelect}
        onRegister={onRegister}
      />

      {isExpanded && <CourseDetails course={course} status={status} />}
    </div>
  );
};

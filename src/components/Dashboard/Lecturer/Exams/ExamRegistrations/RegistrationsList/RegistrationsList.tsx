import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import { RegistrationCard } from "../RegistrationCard/RegistrationCard";
import { IRegistrationsListProps } from "./interface";

export const RegistrationsList = ({
  registrations,
}: IRegistrationsListProps) => {
  if (registrations.length === 0) {
    return (
      <EmptyState
        title="No registrations found"
        description="No students have registered for this exam yet."
        icon="users"
      />
    );
  }

  return (
    <div className="space-y-4">
      {registrations.map((registration, idx) => (
        <RegistrationCard
          key={`${registration.student.firstName}-${registration.registeredAt}-${idx}`}
          registration={registration}
          index={idx}
        />
      ))}
    </div>
  );
};

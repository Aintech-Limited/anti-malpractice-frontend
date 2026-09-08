"use client";
import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { useRouter } from "next/navigation";

export const CourseMaterialsClient = () => {
  const router = useRouter();
  return (
    <EmptyState
      title="No purchased Material"
      action={{
        onClick: () =>
          router.push(ProtectedRouteEnum.STUDENTS + "/courses/catalog"),
        label: "Browse and purchase Ebooks",
      }}
    />
  );
};

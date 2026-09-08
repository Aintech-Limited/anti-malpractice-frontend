import { ReactNode } from "react";
import { Metadata } from "next";
import DepartmentSelectionPrompt from "@/src/components/common/DepartmentSelectionPrompt/DepartmentSelectionPrompt";

export const metadata: Metadata = {
  title: `Students | FINDU Dashboard`,
  description: "Students Dashboard.",
};

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      <DepartmentSelectionPrompt />
    </>
  );
}

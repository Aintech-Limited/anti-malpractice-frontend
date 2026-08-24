import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Lecturers | FINDU Dashboard`,
  description: "Lecturers Dashboard.",
};

export default async function LecturersDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

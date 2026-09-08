import { ReactNode } from "react";
import Layout from "@/src/components/Dashboard/DashboardLayout";
import { AuthProvider } from "@/src/providers/auth/AuthContext";
import { getUserProfile } from "@/src/lib/serverHelper";
import { redirect } from "next/navigation";
import { UnProtectedRouteEnum } from "@/src/lib/enums";
import { NotificationProvider } from "@/src/providers/notifications/NotificationProvider";
import { Metadata } from "next";
import GlobalLoadingIndicator from "@/src/components/common/GlobalLoadingIndicator/GlobalLoadingIndicator";

export const metadata: Metadata = {
  title: `FINDU Dashboard`,
  description: "Dashboard.",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUserProfile();
  if (!user) redirect(UnProtectedRouteEnum.SIGNIN);
  return (
    <AuthProvider userData={user.data}>
      <GlobalLoadingIndicator />
      <NotificationProvider>
        <Layout>{children}</Layout>
      </NotificationProvider>
    </AuthProvider>
  );
}

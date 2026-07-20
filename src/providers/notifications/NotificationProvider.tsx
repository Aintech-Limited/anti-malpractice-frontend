"use client";

import { createContext, useContext, ReactNode } from "react";
import { NotificationContextProps } from "./interface";
import { useNotifications } from "@/src/components/Dashboard/Notifications/hooks/useNotifications";

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationValues = useNotifications();

  return (
    <NotificationContext.Provider value={notificationValues}>
      {children}
    </NotificationContext.Provider>
  );
}

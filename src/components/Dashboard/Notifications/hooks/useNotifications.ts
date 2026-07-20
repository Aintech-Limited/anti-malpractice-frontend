"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  INotification,
  INotificationsResponse,
  IWSNotificationData,
} from "../interface";
import { useAuth } from "@/src/providers/auth/AuthContext";

export const useNotifications = () => {
  const { user } = useAuth();

  const socketRef = useRef<Socket | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial notifications from API
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      const response = await fetch(
        `/api/v1/notifications?page=${page}&limit=${limit}`,
      );
      const result = (await response.json()) as INotificationsResponse;

      if (result.success) {
        setNotifications(result?.data?.notifications ?? []);
        setUnreadCount(result?.data?.extra?.unreadCount ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/v1/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      const result = await response.json();

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  // Mark notification as unread
  const markAsUnread = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/v1/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: false }),
      });

      const result = await response.json();

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: false } : notif,
          ),
        );
        setUnreadCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/notifications/mark-all-read", {
        method: "PUT",
      });

      const result = await response.json();

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true })),
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/v1/notifications/${notificationId}`,
          {
            method: "DELETE",
          },
        );

        const result = await response.json();

        if (result.success) {
          const deletedNotif = notifications.find(
            (n) => n.id === notificationId,
          );
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId),
          );
          if (deletedNotif && !deletedNotif.isRead) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [notifications],
  );

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    socketRef.current = io(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to notifications namespace");
      setIsConnected(true);
    });

    socketRef.current.on("connect_error", (err: Error) => {
      console.error("Connection failed:", err.message);
      setIsConnected(false);
    });

    socketRef.current.on("new_notification", (data: IWSNotificationData) => {
      console.log("New notification received:", data);

      const newNotification: INotification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        isRead: false,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
        metadata: data.metadata,
        userId: user?.id ?? "",
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socketRef.current.on(
      "notification_read",
      (data: { notificationId: string }) => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === data.notificationId
              ? { ...notif, isRead: true }
              : notif,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      },
    );

    socketRef.current.on(
      "notification_deleted",
      (data: { notificationId: string }) => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== data.notificationId),
        );
      },
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [fetchNotifications, user?.id]);

  return {
    notifications,
    unreadCount,
    isConnected,
    loading,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
  };
};

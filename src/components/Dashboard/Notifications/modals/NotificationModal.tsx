"use client";

import { useEffect, useState } from "react";
import { X, Check, RotateCcw, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { INotificationModalProps } from "./interface";
import { INotification } from "../interface";
import { TNotificationTypeEnum } from "@/src/lib/enums";
import { useNotificationContext } from "@/src/providers/notifications/NotificationProvider";

export default function NotificationModal({
  isOpen,
  onClose,
  notification,
}: INotificationModalProps) {
  const { markAsRead, markAsUnread, deleteNotification } =
    useNotificationContext();
  const [currentNotification, setCurrentNotification] =
    useState<INotification | null>(notification);

  useEffect(() => {
    setCurrentNotification(notification);
  }, [notification]);

  if (!isOpen || !currentNotification) return null;

  const handleMarkAsRead = async () => {
    if (!currentNotification.isRead) {
      await markAsRead(currentNotification.id);
      setCurrentNotification({ ...currentNotification, isRead: true });
    }
  };

  const handleMarkAsUnread = async () => {
    if (currentNotification.isRead) {
      await markAsUnread(currentNotification.id);
      setCurrentNotification({ ...currentNotification, isRead: false });
    }
  };

  const handleDelete = async () => {
    await deleteNotification(currentNotification.id);
    onClose();
  };

  const getTypeStyles = (type: TNotificationTypeEnum) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 border-green-200";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ERROR":
        return "bg-red-100 text-red-800 border-red-200";
      case "EXAM":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "GRADE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${getTypeStyles(currentNotification.type)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{currentNotification.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {currentNotification.message}
            </p>
          </div>

          {currentNotification.metadata &&
            Object.keys(currentNotification.metadata).length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">
                  Additional Information:
                </p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {Object.keys(currentNotification.metadata).length > 0
                    ? Object.entries(currentNotification.metadata ?? {}).map(
                        ([key, value], idx) => (
                          <div key={idx}>
                            {!["actionUrl", "resultId"].includes(key)
                              ? `${key}: ${value}`
                              : ""}
                          </div>
                        ),
                      )
                    : ""}
                </pre>
              </div>
            )}

          <div className="text-xs text-gray-400">
            Received: {format(new Date(currentNotification.createdAt), "PPP p")}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
          {!currentNotification.isRead ? (
            <button
              onClick={handleMarkAsRead}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Mark as Read
            </button>
          ) : (
            <button
              onClick={handleMarkAsUnread}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Mark as Unread
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>

          {currentNotification.metadata?.actionUrl && (
            <a
              href={currentNotification.metadata.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              View
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Users, Calendar, Trash2, Edit } from "lucide-react";
import { ILecturerAssignment } from "../interface";
import { IViewLecturersModalProps } from "./interface";
import { assignedLecturerStatusColors, roleColors } from "../constants/constat";

export default function ViewLecturersModal({
  isOpen,
  onClose,
  courseId,
  onUnassign,
  onReassign,
}: IViewLecturersModalProps) {
  const [assignments, setAssignments] = useState<ILecturerAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchAssignments();
    }
  }, [isOpen, courseId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/admin/courses/${courseId}/lecturers`,
      );
      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    if (!onUnassign) return;
    if (confirm("Are you sure you want to unassign this lecturer?")) {
      setUnassigningId(assignmentId);
      await onUnassign(assignmentId);
      await fetchAssignments();
      setUnassigningId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Course Lecturers</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No lecturers assigned to this course yet.
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {assignment.lecturer.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[assignment.role]}`}
                        >
                          {assignment.role.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${assignedLecturerStatusColors[assignment.status]}`}
                        >
                          {assignment.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.lecturer.email}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {formatDate(assignment.startDate)} -{" "}
                            {formatDate(assignment.endDate)}
                          </span>
                        </div>
                      </div>

                      {assignment.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                          {assignment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {onReassign && (
                        <button
                          onClick={() => onReassign(assignment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Reassign"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onUnassign && (
                        <button
                          onClick={() => handleUnassign(assignment.id)}
                          disabled={unassigningId === assignment.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Unassign"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

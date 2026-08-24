import { formatDate } from "@/src/lib/helper";
import { IExamResult } from "../interface";
import { TResultStatusEnum } from "@/src/lib/enums";
import autoTable from "jspdf-autotable";

export const examResultUtils = {
  getGradeColor: (grade: string): string => {
    const gradeMap: Record<string, string> = {
      A: "text-green-600 bg-green-100",
      B: "text-blue-600 bg-blue-100",
      C: "text-yellow-600 bg-yellow-100",
      D: "text-orange-600 bg-orange-100",
      F: "text-red-600 bg-red-100",
    };
    return gradeMap[grade] || "text-gray-600 bg-gray-100";
  },
  exportToPDF: async (data: IExamResult[], filename: string): Promise<void> => {
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import("jspdf");
    import("jspdf-autotable").then(() => {
      const doc = new jsPDF();

      const tableColumn = [
        "Student Name",
        "Course Code",
        "Exam Title",
        "Score",
        "Grade",
        "Passed",
        "Submitted At",
      ];
      const tableRows = data.map((item) => [
        item.user ? `${item.user.firstName} ${item.user.lastName}` : "N/A",
        item.examAttempt.exam.course.courseCode,
        item.examAttempt.exam.title,
        item.score.toString(),
        item.grade,
        item.examAttempt.passed ? "Yes" : "No",
        formatDate(item.submittedAt),
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      });

      doc.save(`${filename}.pdf`);
    });
  },
  exportToCSV: (data: IExamResult[], filename: string): void => {
    const headers = [
      "Student Name",
      "Course Code",
      "Exam Title",
      "Score",
      "Grade",
      "Passed",
      "Submitted At",
    ];

    const rows = data.map((item) => [
      item.user ? `${item.user.firstName} ${item.user.lastName}` : "N/A",
      item.examAttempt.exam.course.courseCode,
      item.examAttempt.exam.title,
      item.score.toString(),
      item.grade,
      item.examAttempt.passed ? "Yes" : "No",
      formatDate(item.submittedAt),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
  statusOptions: [
    { value: "PENDING", label: "Pending" },
    { value: "GRADED", label: "Graded" },
    { value: "RELEASED", label: "Released" },
  ] as { value: TResultStatusEnum; label: string }[],

  sortByOptions: [
    { value: "submittedAt", label: "Submitted Date" },
    { value: "createdAt", label: "Created Date" },
  ],
};

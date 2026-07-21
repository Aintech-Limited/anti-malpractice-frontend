import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { getSafeStringValue } from '../helper';
import { IExamResult } from '@/src/components/Dashboard/Student/Result/interface';
import { toast } from 'react-toastify';

export const exportExamResults = (
	results: IExamResult[],
	format: 'PDF' | 'CSV',
) => {
	if (!results?.length) {
		toast.error('No data available to export.');
		return;
	}

	const CourseCode = results[0]?.examAttempt?.exam?.course?.courseCode;

	const flattenedData = results.map((item) => ({
		Student: `${getSafeStringValue(item.user?.firstName)} ${getSafeStringValue(item.user?.lastName)}`,
		StudentID: getSafeStringValue(item.user?.id),
		ExamTitle: getSafeStringValue(item.examAttempt?.exam?.title),
		CourseCode: getSafeStringValue(item.examAttempt?.exam?.course?.courseCode),
		CourseTitle: getSafeStringValue(item.examAttempt?.exam?.course?.title),
		Score: getSafeStringValue(item.score),
		Grade: getSafeStringValue(item.grade),
		Passed:
			item.examAttempt?.passed === true
				? 'Yes'
				: item.examAttempt?.passed === false
					? 'No'
					: 'N/A',
		SubmittedAt: item.submittedAt
			? new Date(item.submittedAt).toLocaleString()
			: 'N/A',
	}));

	if (format === 'PDF') {
		generatePDF(flattenedData, CourseCode);
	} else {
		generateCSV(flattenedData, CourseCode);
	}
};

const generatePDF = (data: any[], CourseCode: string) => {
	const doc = new jsPDF();

	// Title
	doc.setFontSize(18);
	doc.text('Exam Results Report', 14, 20);

	doc.setFontSize(11);
	doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

	const headers = [
		'Student',
		'Student ID',
		'Exam Title',
		'Course',
		'Score',
		'Grade',
		'Passed',
		'Submitted At',
	];

	const rows = data.map((row) => [
		row.Student,
		row.StudentID,
		row.ExamTitle,
		row.CourseTitle,
		row.Score,
		row.Grade,
		row.Passed,
		row.SubmittedAt,
	]);

	// Generate Table
	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: 40,
		theme: 'grid',
		headStyles: { fillColor: [41, 128, 185] }, // Blue header
		styles: { fontSize: 9, cellPadding: 3 },
		columnStyles: {
			0: { cellWidth: 40 }, // Student
			1: { cellWidth: 35 }, // ID
			2: { cellWidth: 50 }, // Exam
			3: { cellWidth: 40 }, // Course
			4: { cellWidth: 15 }, // Score
			5: { cellWidth: 15 }, // Grade
			6: { cellWidth: 15 }, // Passed
			7: { cellWidth: 40 }, // Date
		},
	});

	// Save
	doc.save(`exam-results-${CourseCode.replaceAll(' ', '')}-${Date.now()}.pdf`);
};

const generateCSV = (data: any[], CourseCode: string) => {
	// Convert to CSV string
	const csv = Papa.unparse({
		fields: [
			'Student',
			'Student ID',
			'Exam Title',
			'Course Code',
			'Course Title',
			'Score',
			'Grade',
			'Passed',
			'Submitted At',
		],
		data: data.map((row) => [
			row.Student,
			row.StudentID,
			row.ExamTitle,
			row.CourseCode,
			row.CourseTitle,
			row.Score,
			row.Grade,
			row.Passed,
			row.SubmittedAt,
		]),
	});

	// Create Blob and Download
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.setAttribute('href', url);
	link.setAttribute(
		'download',
		`exam-results-${CourseCode.replaceAll(' ', '')}-${Date.now()}.csv`,
	);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

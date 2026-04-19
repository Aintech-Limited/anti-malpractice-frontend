import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { IRegistrationsHeaderProps } from './interface';

export const RegistrationsHeader = ({
	examTitle,
	examId,
	onExport,
	totalRegistrations,
}: IRegistrationsHeaderProps) => {
	return (
		<div className="mb-8">
			<div className="flex items-center gap-4 mb-4">
				<Link
					href="/dashboard/lecturer/exams"
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					Back to Exams
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Exam Registrations
					</h1>
					<p className="text-gray-600 mt-1">
						{examTitle} • {totalRegistrations} student
						{totalRegistrations !== 1 ? 's' : ''} registered
					</p>
				</div>

				<button
					onClick={onExport}
					className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
				>
					<Download className="w-5 h-5" />
					Export to CSV
				</button>
			</div>
		</div>
	);
};

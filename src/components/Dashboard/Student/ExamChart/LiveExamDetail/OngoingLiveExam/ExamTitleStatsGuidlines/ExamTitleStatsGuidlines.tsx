'use client';

import { formatMinutes } from '@/src/lib/helper';
import { ShieldCheck } from 'lucide-react';

const ExamTitleStatsGuidlines = ({
	examTitle,
	fullMarksTotal,
	examDurationTotal,
}: {
	examTitle?: string;
	fullMarksTotal?: number | string;
	examDurationTotal?: string | number;
}) => {
	return (
		<>
			{/* Exam Title & Stats */}
			<div className="text-center mb-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					{examTitle ?? 'N/A'}
				</h1>
				<p className="text-sm text-gray-500 font-medium">
					Full Mark: {fullMarksTotal ?? 'N/A'} | Time:{' '}
					{examDurationTotal ? formatMinutes(examDurationTotal!) : 'N/A'}
				</p>
			</div>

			{/* Guidelines */}
			<div className="bg-[#E9EDF2] rounded-lg p-6 border border-gray-200">
				<div className="flex items-center gap-2 mb-3 justify-center">
					<ShieldCheck className="w-5 h-5 text-gray-700" />
					<h2 className="font-bold text-gray-800 uppercase tracking-wide">
						Exam Guidelines
					</h2>
				</div>
				<ul className="list-disc list-inside space-y-1 text-sm text-gray-600 max-w-md mx-auto">
					<li>Follow all instructions given by the supervisor.</li>
					<li>No external aids or unauthorized devices.</li>
				</ul>
			</div>
		</>
	);
};
export default ExamTitleStatsGuidlines;

'use client';

import { IDBExamQuestion } from '@/src/lib/db/interface';
import { formatTime } from '@/src/lib/helper';
import { CheckCircle2, Clock } from 'lucide-react';

const StickyProgressHeader = ({
	answeredCount,
	questions,
	progressPercentage,
	timeLeft,
}: {
	questions: IDBExamQuestion[];
	answeredCount: number;
	progressPercentage: number;
	timeLeft: number;
}) => {
	return (
		<div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3">
			<div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 text-blue-600">
						<Clock className="w-5 h-5" />
						<span className="font-mono font-bold text-lg">
							{formatTime(timeLeft)}
						</span>
					</div>
					<div className="h-6 w-px bg-gray-300 hidden md:block" />
					<div className="flex items-center gap-2 text-gray-600 text-sm">
						<CheckCircle2 className="w-4 h-4 text-green-500" />
						<span>
							{answeredCount} of {(questions || []).length} Answered
						</span>
					</div>
				</div>

				{/* Progress Bar Container */}
				<div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2.5 relative">
					<div
						className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

export default StickyProgressHeader;

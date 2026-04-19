import { ClipboardList, Calendar, Clock, DollarSign } from 'lucide-react';
import { IExamsStatsProps } from './interface';

export const ExamsStats = ({
	totalExams,
	upcomingExams,
	ongoingExams,
	completedExams,
}: IExamsStatsProps) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-gray-500 text-sm">Total Exams</p>
						<p className="text-2xl font-bold text-gray-800">{totalExams}</p>
					</div>
					<ClipboardList className="w-8 h-8 text-indigo-100" />
				</div>
			</div>
			<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-gray-500 text-sm">Upcoming</p>
						<p className="text-2xl font-bold text-blue-600">{upcomingExams}</p>
					</div>
					<Calendar className="w-8 h-8 text-blue-100" />
				</div>
			</div>
			<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-gray-500 text-sm">Ongoing</p>
						<p className="text-2xl font-bold text-green-600">{ongoingExams}</p>
					</div>
					<Clock className="w-8 h-8 text-green-100" />
				</div>
			</div>
			<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-gray-500 text-sm">Total Revenue</p>
						<p className="text-2xl font-bold text-gray-800">-</p>
					</div>
					<DollarSign className="w-8 h-8 text-yellow-100" />
				</div>
			</div>
		</div>
	);
};

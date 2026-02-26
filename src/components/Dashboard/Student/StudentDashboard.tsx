'use client';

import { Radio, Pencil, BarChart2 } from 'lucide-react';
import ExamRow from './ExamRow/ExamRow';
import { useRouter } from 'next/navigation';

const StudentDashboard = () => {
	const router = useRouter();

	const stats = [
		{ id: '1', label: 'Course Completed', value: '57' },
		{ id: '2', label: 'Online Exam', value: '21' },
		{ id: '3', label: 'Registration Course', value: '57' },
		{ id: '4', label: 'Drop Semester', value: '01' },
	];

	return (
		<section className="bg-[#E9EEF2] min-h-screen p-6 md:p-12 font-sans">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
				{/* Overview */}
				<div className="w-full md:w-1/3">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
					<div className="space-y-4">
						{stats.map((stat) => (
							<div
								key={stat.id}
								className="bg-white p-6 rounded-xl shadow-sm flex flex-col cursor-pointer
                           transition-all duration-300 ease-out
                           hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5 active:scale-95"
								onClick={() => {
									if (stat.id === '2') {
										router.push('/dashboard/students/exams');
									}
								}}
							>
								<span className="text-gray-900 font-bold text-lg mb-4">
									{stat.label}
								</span>
								<span className="text-4xl font-bold text-gray-800 self-end">
									{stat.value}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Today Plan */}
				<div className="w-full md:w-2/3">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Today Plan</h2>
					<div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
						{/* Live Exam Section */}
						<div className="mb-8">
							<div className="bg-[#EF5350] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6 animate-pulse-red">
								<Radio size={20} className="animate-pulse" />
								<span className="uppercase text-sm tracking-wide">
									Live Exam
								</span>
							</div>

							<div className="space-y-4">
								<ExamRow
									time="09.00AM"
									title="Artificial Intelligence Live Exam E-02 (Live Exam)"
									action="Go to Exam"
									isLive={true}
								/>
								<ExamRow
									time="10.00AM"
									title="Computer Science Live Exam E-02 (Live Exam)"
									action="Go to Exam"
									isLive={true}
								/>
							</div>
						</div>

						<hr className="border-gray-100 my-8" />

						{/* Practice Exam Section */}
						<div className="mb-8">
							<div className="bg-[#34C759] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6">
								<Pencil size={18} />
								<span className="uppercase text-sm tracking-wide">
									Practice Exam
								</span>
							</div>
							<ExamRow
								time="08.00PM"
								title="Highway Engineering/ Test"
								action="Join Class"
							/>
						</div>

						<hr className="border-gray-100 my-8" />

						{/* Results Section */}
						<div>
							<div className="bg-[#1A1AFF] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6">
								<BarChart2 size={20} />
								<span className="uppercase text-sm tracking-wide">Results</span>
							</div>
							<div className="space-y-4">
								<ExamRow
									time="11:00AM"
									title="Computer Science Exam E-02"
									action="View Result"
								/>
								<ExamRow
									time="02:00PM"
									title="Artificial Intelligence Exam E-02"
									action="View Result"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default StudentDashboard;

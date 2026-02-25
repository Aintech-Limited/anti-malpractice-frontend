'use client';

import { useEffect, useState } from 'react';
import { Radio, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { studentReadingImage } from '@/public/assetLinks';
import { guidelines, stats } from './data';
import { ExamStage, ExamStageValue } from './interface';
import WrittenExam from './WrittenExam/WrittenExam';

const ExamDetail = () => {
	const [agreed, setAgreed] = useState<boolean>(false);
	const [startExam, setStartExam] = useState<boolean>(false);
	const [examType, setExamType] = useState<null | ExamStageValue>(null);

	useEffect(() => {
		const handleFaceAuth = () => {
			setStartExam(true);
		};
		if (examType) {
			// TODO: show face auth verification
			handleFaceAuth();
		}
	}, [examType]);

	if (startExam) {
		return <WrittenExam examType={examType!} />;
	}

	return (
		<section className="bg-white min-h-screen py-12 px-6 font-sans">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col items-center mb-12">
					<div className="bg-[#EF5350] text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase mb-4 animate-pulse-red">
						<Radio size={16} />
						LIVE EXAM
					</div>
					<h1 className="text-3xl font-bold text-gray-900 text-center">
						Chemistry Live Exam E-02 (Live Exam)
					</h1>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
					{stats.map((stat, idx) => (
						<div
							key={idx}
							className="bg-[#F1F5F9] rounded-xl p-6 border border-gray-100 shadow-sm"
						>
							<h4 className="text-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
								{stat.title}
							</h4>
							<div className="space-y-3">
								{Object.entries(stat.data).map(([key, value]) => (
									<div
										key={key}
										className="flex justify-between text-xs font-bold"
									>
										<span className="text-gray-500 uppercase">{key}:</span>
										<span className="text-gray-900">{value}</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
					<div className="bg-[#F1F5F9] rounded-3xl p-8 md:p-12 h-full">
						<h3 className="text-center font-bold text-gray-900 mb-8 text-lg underline underline-offset-8 decoration-2 decoration-gray-300">
							Guidelines for students
						</h3>
						<ol className="space-y-4">
							{guidelines.map((text, i) => (
								<li
									key={i}
									className="flex gap-3 text-xs md:text-sm font-bold text-gray-700 leading-relaxed"
								>
									<span className="text-gray-900">{i + 1}.</span>
									{text}
								</li>
							))}
						</ol>
					</div>

					<div className="relative h-full min-h-100">
						<Image
							src={studentReadingImage}
							alt="Students in exam hall"
							className="rounded-3xl object-cover w-full h-full shadow-lg"
							width={180}
							height={90}
						/>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex flex-col items-center gap-8 border-t border-gray-100 pt-12">
					<div className="w-full max-w-xs">
						<label className="block text-center text-xs font-bold text-gray-500 mb-2">
							Version
						</label>
						<div className="relative group">
							<div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 flex items-center justify-between group-hover:border-blue-400 transition-colors cursor-pointer text-sm font-bold">
								Yoruba
								<ChevronDown size={18} />
							</div>
						</div>
					</div>

					<label className="flex items-center gap-3 cursor-pointer group">
						<input
							type="checkbox"
							checked={agreed}
							onChange={() => setAgreed(!agreed)}
							className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
						/>
						<span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
							I agree with the terms and conditions
						</span>
					</label>

					<div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
						<button
							disabled={!agreed}
							className={`px-12 py-4 rounded-xl font-bold text-sm transition-all shadow-lg
                ${
									agreed
										? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-200 active:scale-95'
										: 'bg-gray-200 text-gray-400 cursor-not-allowed'
								}
              `}
							onClick={() => setExamType('SMQ')}
						>
							Start SMQ Exam
						</button>
						<button
							disabled={!agreed}
							className={`px-12 py-4 rounded-xl font-bold text-sm transition-all shadow-lg
                ${
									agreed
										? 'bg-[#E68A00] text-white hover:bg-[#cc7a00] shadow-orange-100 active:scale-95'
										: 'bg-gray-200 text-gray-400 cursor-not-allowed'
								}
              `}
							onClick={() => setExamType('WRITTEN')}
						>
							Start Written Exam
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ExamDetail;

'use client';

import { Maximize2 } from 'lucide-react';

const ResumeFullScreenModal = ({
	onReEnterFullscreen,
}: {
	onReEnterFullscreen: () => void;
}) => {
	return (
		<div className="fixed inset-0 z-200 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
			<div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl">
				<div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
					<Maximize2 className="w-8 h-8 text-amber-600" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Fullscreen Required
				</h2>
				<p className="text-gray-600 mb-8">
					The exam interface has been hidden for security. You must be in
					fullscreen mode to view questions and submit.
				</p>
				<button
					onClick={onReEnterFullscreen}
					className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
				>
					Resume Exam Session
				</button>
			</div>
		</div>
	);
};

export default ResumeFullScreenModal;

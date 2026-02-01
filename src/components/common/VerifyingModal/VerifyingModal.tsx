'use client';

import { useEffect, useState } from 'react';
import { IVerifyingModalProps } from './interface';

const VerifyingModal = ({
	initialProgress = 1,
	onComplete,
	message = 'Loading',
}: IVerifyingModalProps) => {
	const [progress, setProgress] = useState(initialProgress);

	useEffect(() => {
		if (progress < 100) {
			const timer = setTimeout(() => setProgress((prev) => prev + 1), 100);
			return () => clearTimeout(timer);
		} else if (onComplete) {
			onComplete();
		}
	}, [progress, onComplete]);

	const radius = 70;
	const stroke = 12;
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className="fixed inset-0 z-20 flex items-center justify-center bg-white">
			<div className="flex flex-col items-center">
				<div className="relative flex items-center justify-center">
					<svg
						height={radius * 2}
						width={radius * 2}
						className="transform -rotate-90"
					>
						{/* Background Track*/}
						<circle
							stroke="transparent"
							fill="transparent"
							strokeWidth={stroke}
							r={normalizedRadius}
							cx={radius}
							cy={radius}
						/>

						{/* Progress Track */}
						<circle
							stroke="#0000FF"
							fill="transparent"
							strokeWidth={stroke}
							strokeDasharray={circumference + ' ' + circumference}
							style={{
								strokeDashoffset,
								transition: 'stroke-dashoffset 0.35s',
							}}
							strokeLinecap="round"
							r={normalizedRadius}
							cx={radius}
							cy={radius}
						/>
					</svg>

					{/* Percentage Text */}
					<div className="absolute text-2xl font-bold text-blue-700">
						{progress}%
					</div>
				</div>

				{/* Loading Label */}
				<p className="mt-8 text-slate-900 font-medium tracking-wide">
					{message}
				</p>
			</div>
		</div>
	);
};

export default VerifyingModal;

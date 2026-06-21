'use client';

import { memo } from 'react';
import { Scan, Camera, X } from 'lucide-react';
import { IFaceIDSetupModalProps } from './interface';
import { useRouter } from 'next/navigation';

const FaceIDSetupModal = memo(({ isOpen, onClose }: IFaceIDSetupModalProps) => {
	const router = useRouter();

	if (!isOpen) return null;

	const handleClose = () => {
		onClose();
	};

	const handleInitiateFaceAuth = () => {
		router.push('/dashboard/face-capture');
		onClose();
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
				isOpen ? 'opacity-100' : 'opacity-0'
			} `}
		>
			<div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

			{/* Modal Content */}
			<div
				className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 md:p-12 transform transition-transform duration-300 ${
					isOpen ? 'scale-100' : 'scale-95'
				}`}
			>
				<div className="flex flex-col items-center text-center">
					<div className="relative flex items-center justify-center mb-18 mt-12">
						<div className="w-56 h-56 md:w-64 md:h-64 border border-blue-100 rounded-full absolute animate-ping opacity-20" />
						<div className="w-56 h-56 md:w-64 md:h-64 border border-slate-100 rounded-full absolute" />

						{/* Middle Ring */}
						<div className="w-40 h-40 md:w-48 md:h-48 border border-slate-200 rounded-full absolute" />

						{/* Inner Ring */}
						<div className="w-24 h-24 md:w-32 md:h-32 border border-slate-300 rounded-full flex items-center justify-center relative bg-white shadow-inner">
							<div className="text-blue-600 relative flex items-center justify-center">
								<Scan size={56} strokeWidth={2} />
								<div className="absolute">
									<Camera size={20} fill="currentColor" strokeWidth={0} />
								</div>
							</div>
						</div>
					</div>

					{/* Text Content */}
					<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
						Face ID for faster signin
					</h2>

					<p className="text-slate-500 text-sm md:text-base leading-relaxed mb-10 max-w-xs">
						Setup Face Authentication for secured examination.
					</p>

					{/* Action Buttons */}
					<div className="w-full space-y-4">
						<button
							onClick={handleInitiateFaceAuth}
							className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
						>
							Enable Face ID
						</button>

						<button
							onClick={() => handleClose()}
							className="w-full py-2 text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm cursor-pointer"
						>
							Skip, I&apos;ll do this later
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});
FaceIDSetupModal.displayName = 'FaceIDSetupModal';
export default FaceIDSetupModal;

'use client';

import {
	Camera,
	ChevronRight,
	ArrowLeft,
	HelpCircle,
	CreditCard,
	IdCard,
} from 'lucide-react';
import { TVerifyStage } from '../interface';
import { useAppDispatch } from '@/src/redux/reduxStore';
import { setLecturerVerifyState } from '@/src/redux/features/lecturerVerify/lecturerVerifySlice';
import { PhotoIdType, PhotoIdTypeValue } from '@/src/lib/enums';

const GovernmentId = ({
	setStage,
}: {
	setStage: (stage: TVerifyStage) => void;
}) => {
	const dispatch = useAppDispatch();

	const handleIdSelect = (photoIdType: PhotoIdTypeValue) => {
		dispatch(setLecturerVerifyState({ photoIdType }));
		setStage('ID_CAPTURE');
	};
	return (
		<div className="min-h-screen bg-neutral-100 flex justify-center items-center p-4">
			{/* Phone Container */}
			<div className="relative w-full max-w-sm bg-neutral-200 rounded-3xl overflow-hidden shadow-lg">
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3">
					<button className="p-2">
						<ArrowLeft
							className="w-5 h-5"
							onClick={() => setStage('VERIFICATION_OPTIONS')}
						/>
					</button>

					<h1 className="text-sm font-medium">Verify identity</h1>

					<button className="p-2">
						<HelpCircle className="w-5 h-5" />
					</button>
				</div>

				{/* ID Card Preview Area */}
				<div className="px-4 mt-2">
					<div className="bg-neutral-400 rounded-xl p-4 text-center">
						{/* ID Card */}
						<div className="bg-white rounded-md mx-auto w-48 h-28 flex items-center justify-center mb-3 shadow">
							<span className="text-xs text-neutral-500">
								Government ID Preview
							</span>
						</div>

						<h2 className="font-semibold text-sm">Government ID</h2>

						<p className="text-xs text-neutral-700 mt-1 leading-relaxed">
							Rem ipsum dolor sit amet consectetur.
							<br />
							Donec nibh enim mauris
						</p>

						<button className="flex items-center justify-center gap-2 mx-auto mt-3 text-sm font-medium text-blue-600">
							<Camera className="w-4 h-4" />
							Take a photo
						</button>

						{/* Pagination Dots */}
						<div className="flex justify-center gap-1 mt-3">
							<span className="w-2 h-1 bg-white rounded-full"></span>
							<span className="w-1.5 h-1 bg-neutral-300 rounded-full"></span>
							<span className="w-1.5 h-1 bg-neutral-300 rounded-full"></span>
						</div>
					</div>
				</div>

				{/* Bottom Sheet */}
				<div className="bg-white rounded-t-3xl mt-4 px-5 pt-4 pb-6">
					{/* Drag Indicator */}
					<div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-4" />

					<h3 className="font-semibold text-base">
						Let&apos;s get you verified!
					</h3>

					<p className="text-sm text-neutral-600 mt-1 mb-4">
						Which photo ID would you like to use?
					</p>

					{/* Options */}
					<div className="space-y-3">
						{/* Driver License */}
						<button
							onClick={() => handleIdSelect(PhotoIdType.DRIVER_LICENSE)}
							className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 transition"
						>
							<div className="flex items-center gap-3">
								<div className="bg-orange-500 p-2 rounded-full text-white">
									<CreditCard className="w-4 h-4" />
								</div>
								<span className="text-sm font-medium">
									Driver&apos;s License
								</span>
							</div>

							<ChevronRight className="w-4 h-4 text-neutral-400" />
						</button>

						{/* National ID */}
						<button
							onClick={() => handleIdSelect(PhotoIdType.NATIONAL_ID_CARD)}
							className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 transition"
						>
							<div className="flex items-center gap-3">
								<div className="bg-emerald-600 p-2 rounded-full text-white">
									<IdCard className="w-4 h-4" />
								</div>
								<span className="text-sm font-medium">
									National Identity Card
								</span>
							</div>

							<ChevronRight className="w-4 h-4 text-neutral-400" />
						</button>

						{/* Passport */}
						<button
							onClick={() => handleIdSelect(PhotoIdType.INTERNATIONAL_PASSWORT)}
							className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 transition"
						>
							<div className="flex items-center gap-3">
								<div className="bg-purple-700 p-2 rounded-full text-white">
									<IdCard className="w-4 h-4" />
								</div>
								<span className="text-sm font-medium">Passport</span>
							</div>

							<ChevronRight className="w-4 h-4 text-neutral-400" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GovernmentId;

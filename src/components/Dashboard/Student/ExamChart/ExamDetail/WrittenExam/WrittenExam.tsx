import { useState, useEffect, useRef } from 'react';
import {
	ShieldCheck,
	Clock,
	CheckCircle2,
	Maximize2,
	UserCheck,
	Activity,
} from 'lucide-react';
import { questions } from './data';
import { CameraType, Violation } from '@/src/lib/proctoring/interface';
import { ProctoringController } from '@/src/lib/proctoring/controller';
import { toast } from 'react-toastify';
import { ExamSummary } from '../ExamSummary/ExamSummary';
import { ExamStageValue } from '../interface';

const TIME_ALLOWED = 160 * 60; // 2h 40min in seconds

const WrittenExam = ({ examType }: { examType: ExamStageValue }) => {
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [timeLeft, setTimeLeft] = useState<number>(TIME_ALLOWED);

	const [violations, setViolations] = useState<Violation[]>([]);
	const [isFullscreen, setIsFullscreen] = useState(true); // Track fullscreen status
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showViolationModal, setShowViolationModal] = useState(false);
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

	const videoRef = useRef<HTMLVideoElement | null>(null);

	const proctorRef = useRef<ProctoringController | null>(null);

	// Sync Camera Feed for UI
	useEffect(() => {
		const getStream = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				setCameraStream(stream);
				if (videoRef.current) videoRef.current.srcObject = stream;
			} catch (err) {
				toast.error('Camera access required for proctoring.');
			}
		};
		getStream();
	}, []);

	// Monitor Fullscreen Status
	useEffect(() => {
		const handleFsChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener('fullscreenchange', handleFsChange);
		return () =>
			document.removeEventListener('fullscreenchange', handleFsChange);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (proctorRef.current) {
				const isFaceMissing = !proctorRef.current.faceDetected;
				toast.info(`isFaceMissing: ${isFaceMissing}`);

				if (isFaceMissing && !isSubmitted) {
					if (!showViolationModal) {
						setShowViolationModal(true);
						toast.error('setting face modal');
					}
				} else {
					if (showViolationModal) {
						setShowViolationModal(false);
						toast.error('removing face modal');
					}
				}
			}
		}, 500);

		return () => clearInterval(interval);
	}, [isSubmitted, showViolationModal]);

	// locked-down efffect
	useEffect(() => {
		const preventCheating = (
			e: KeyboardEvent | ClipboardEvent | MouseEvent,
		) => {
			// Prevent Right Click
			if (e.type === 'contextmenu') {
				e.preventDefault();
				toast.error('Right-click is disabled during the exam.');
			}

			// Prevent Copy/Paste/Cut
			if (['copy', 'paste', 'cut'].includes(e.type)) {
				e.preventDefault();
				toast.error('Clipboard actions are disabled.');
			}

			if (e instanceof KeyboardEvent) {
				const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
				const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

				// Block Ctrl+C, Ctrl+V, Ctrl+U (View Source), Ctrl+S (Save), Ctrl+P (Print)
				if (
					cmdOrCtrl &&
					['c', 'v', 'u', 's', 'p', 'x', 'a'].includes(e.key.toLowerCase())
				) {
					e.preventDefault();
					toast.error(`Shortcut ${e.key.toUpperCase()} is blocked.`);
				}

				// Block F12 and Ctrl+Shift+I (DevTools)
				if (
					e.key === 'F12' ||
					(cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'i')
				) {
					e.preventDefault();
					toast.warning('Developer Tools access is a violation.');
				}
			}
		};

		document.addEventListener('contextmenu', preventCheating);
		document.addEventListener('copy', preventCheating);
		document.addEventListener('paste', preventCheating);
		document.addEventListener('cut', preventCheating);
		document.addEventListener('keydown', preventCheating);

		return () => {
			document.removeEventListener('contextmenu', preventCheating);
			document.removeEventListener('copy', preventCheating);
			document.removeEventListener('paste', preventCheating);
			document.removeEventListener('cut', preventCheating);
			document.removeEventListener('keydown', preventCheating);
		};
	}, []);

	useEffect(() => {
		const handleViolationWarning = (v: Violation) => {
			toast.info(`faceDetected: ${proctorRef?.current?.faceDetected}`);
			if (v.type === 'EXIT_FULLSCREEN') {
				toast.warn(
					`Violation: ${v.type.replaceAll('_', ' ')}. Your activity is being recorded.`,
				);
			}

			if (v.type === 'TAB_SWITCH') {
				toast.error('CRITICAL VIOLATION: Tab switching is prohibited!', {
					position: 'top-center',
					autoClose: false,
				});
			}
		};

		const handleScreenShot = async () => {
			try {
				const [cameraSnap, screenSnap] = await Promise.all([
					proctorRef?.current?.captureFrame(CameraType.CAMERA),
					proctorRef?.current?.captureFrame(CameraType.SCREEN),
				]);
				if (!cameraSnap && !screenSnap) return;
				// TODO: Use websocket connection for this

				await fetch('/api/v1/proctoring/exam/evidence', {
					method: 'POST',
					body: JSON.stringify({
						examId: 'chemistry-02',
						examAttemptId: '',
						timestamp: Date.now(),
						camera: cameraSnap, // base64
						screen: screenSnap,
						violationsCount: violations.length,
					}),
					headers: { 'Content-Type': 'application/json' },
				});
				console.log('Evidence synced to backend.');
			} catch (error) {
				console.error('Failed to sync proctoring evidence', error);
			}
		};

		proctorRef.current = new ProctoringController({
			requireFullscreen: true,
			requireCamera: true,
			requireScreenShare: true,
			onViolation: (v) => {
				setViolations((prev) => [...prev, v]);

				console.log('Violation detected:', v.type);
				toast.error(`Violation detected: ${v.type.replaceAll('_', ' ')}`);

				handleViolationWarning(v);
			},
		});

		// Start proctoring
		const startProctoring = async () => {
			try {
				await proctorRef.current?.start();
			} catch (err) {
				console.error('Failed to start proctoring:', err);
			}
		};

		startProctoring();

		return () => {
			proctorRef.current?.stop();
		};
	}, [violations.length]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleReEnterFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
			}
		} catch (err) {
			toast.error('Please enable fullscreen to continue.');
		}
	};

	const formatTime = (seconds: number) => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return `${h}h ${m}m ${s}s`;
	};

	const answeredCount = Object.keys(answers).filter(
		(id) => answers[parseInt(id)].trim() !== '',
	).length;
	const progressPercentage = (answeredCount / questions.length) * 100;

	const handleInputChange = (id: number, value: string) => {
		setAnswers((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async () => {
		proctorRef.current?.stop();
		// TODO: send 'answers' and 'violations' to API here
		setIsSubmitted(true);
	};

	if (isSubmitted) {
		return (
			<ExamSummary
				questions={
					examType === 'SMQ'
						? questions.filter((q) => q.type === 'smq')
						: questions.filter((q) => q.type === 'written')
				}
				answers={answers}
				violations={violations}
				timeSpent={formatTime(TIME_ALLOWED - timeLeft)}
				onClose={() => (window.location.href = '/dashboard')}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F9FB] pb-24 select-none flex flex-col md:flex-row">
			<aside className="fixed bottom-4 right-4 md:top-24 md:left-4 z-40 w-48 md:w-56 space-y-4">
				{/* Live Camera Feed */}
				<div className="bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-gray-200 aspect-video relative mt-10">
					<video
						ref={videoRef}
						autoPlay
						muted
						playsInline
						className="w-full h-full object-cover grayscale-[0.5]"
					/>
					<div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded-full">
						<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
						<span className="text-[10px] font-bold text-white uppercase tracking-wider">
							Live
						</span>
					</div>
				</div>

				{/* Status Dashboard */}
				<div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hidden md:block">
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
						<Activity className="w-3 h-3" /> System Health
					</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between text-xs font-medium">
							<span className="text-gray-600">Camera</span>
							<span className="text-green-500 flex items-center gap-1">
								<UserCheck className="w-3 h-3" /> Active
							</span>
						</div>
						<div className="flex items-center justify-between text-xs font-medium">
							<span className="text-gray-600">Screen</span>
							<span className="text-green-500">Sharing</span>
						</div>
						<div className="flex items-center justify-between text-xs font-medium">
							<span className="text-gray-600">Violations</span>
							<span
								className={`${violations.length > 0 ? 'text-red-500' : 'text-gray-400'}`}
							>
								{violations.length} Detected
							</span>
						</div>
					</div>
				</div>
			</aside>

			{!isFullscreen && (
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
							onClick={handleReEnterFullscreen}
							className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
						>
							Resume Exam Session
						</button>
					</div>
				</div>
			)}

			<main
				className={`flex-1 transition-all duration-300 ${!isFullscreen ? 'blur-2xl' : ''}`}
			>
				{/* STICKY PROGRESS HEADER */}
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
									{answeredCount} of {questions.length} Answered
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

				<div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
					{/* Exam Title & Stats */}
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-gray-800 mb-2">
							Chemistry Live Exam E-02
						</h1>
						<p className="text-sm text-gray-500 font-medium">
							Full Mark: 70 | Time: 2h 40min
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

					{/* Questions Area */}
					<div className="space-y-8">
						{questions
							.filter((q) =>
								examType === 'SMQ' ? q.type === 'smq' : q.type === 'written',
							)
							.map((q) => (
								<div
									key={q.id}
									className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5"
								>
									<div className="bg-[#EBEFFF] px-6 py-2 inline-block rounded-br-2xl">
										<span className="text-sm font-bold text-blue-800">
											Question {q.id}
										</span>
									</div>

									<div className="p-8">
										<p className="text-lg font-semibold text-gray-800 mb-8">
											{q.questionText}
										</p>

										{examType === 'SMQ' ? (
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{q.options?.map((option, index) => {
													const label = String.fromCharCode(65 + index);
													const isSelected = answers[q.id] === option;
													return (
														<button
															key={option}
															onClick={() => handleInputChange(q.id, option)}
															className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
																isSelected
																	? 'border-blue-500 bg-blue-50'
																	: 'border-gray-100 hover:border-gray-300'
															}`}
														>
															<span
																className={`w-8 h-8 flex items-center justify-center rounded-full border font-bold text-sm ${
																	isSelected
																		? 'bg-blue-600 border-blue-600 text-white'
																		: 'bg-gray-50 border-gray-300 text-gray-500'
																}`}
															>
																{label}
															</span>
															<span
																className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}
															>
																{option}
															</span>
														</button>
													);
												})}
											</div>
										) : examType === 'WRITTEN' ? (
											<textarea
												rows={4}
												className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 outline-none transition-all resize-none"
												placeholder="Type your explanation here..."
												value={answers[q.id] || ''}
												onChange={(e) =>
													handleInputChange(q.id, e.target.value)
												}
											/>
										) : null}
									</div>
								</div>
							))}
					</div>

					{/* Submit Action */}
					<div className="flex justify-center pt-10">
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
							onClick={handleSubmit}
						>
							Finalize and Submit
						</button>
					</div>
				</div>
				{/* Alert Overlay for major violations */}
				{/* {showViolationModal && (
					<div className="fixed inset-0 z-200 bg-red-600/90 backdrop-blur-sm flex items-center justify-center text-white p-10 text-center">
						<div className="max-w-md animate-pulse">
							<div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
								<UserCheck className="w-10 h-10 text-white" />
							</div>
							<h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
								Face Not Detected!
							</h2>
							<p className="text-lg font-medium opacity-90">
								Exam on Hold. Please reposition yourself clearly in front of the
								camera to resume.
							</p>
							<div className="mt-8 text-xs font-mono bg-black/20 py-2 px-4 rounded-full inline-block">
								Monitoring active...
							</div>
						</div>
					</div>
				)} */}
			</main>
		</div>
	);
};

export default WrittenExam;

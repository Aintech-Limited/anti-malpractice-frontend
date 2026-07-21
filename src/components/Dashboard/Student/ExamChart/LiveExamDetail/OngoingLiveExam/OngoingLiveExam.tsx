'use client';

import { useState, useEffect, useRef } from 'react';
import {
	CameraType,
	ProctoringViolationEnum,
	TViolation,
} from '@/src/lib/proctoring/interface';
import { ProctoringController } from '@/src/lib/proctoring/controller';
import { toast } from 'react-toastify';
import { ExamSummary } from '../ExamSummary/ExamSummary';
import { DBExamAnswerSyncEnum, ProtectedRouteEnum } from '@/src/lib/enums';
import DBExamRepository from '@/src/lib/db/repository';
import { useProctoringSocket } from './hook/useProctoringSocket';
import {
	IDBExamAnswer,
	IDBExamMeta,
	IDBExamQuestion,
	IDBExamQuestionOption,
} from '@/src/lib/db/interface';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { IOngoingLiveExamProps } from './interface';
import { formatTime } from '@/src/lib/helper';
import { useRouter } from 'next/navigation';
import ViolaTionModal from './ViolaTionModal/ViolaTionModal';
import ScreenShareModal from './ScreenShareModal/ScreenShareModal';
import StickyProgressHeader from './StickyProgressHeader/StickyProgressHeader';
import ResumeFullScreenModal from './ResumeFullScreenModal/ResumeFullScreenModal';
import ExamStatusDashboard from './ExamStatusDashboard/ExamStatusDashboard';
import ExamLiveCameraFeed from './ExamLiveCameraFeed/ExamLiveCameraFeed';
import ExamTitleStatsGuidlines from './ExamTitleStatsGuidlines/ExamTitleStatsGuidlines';
import QuestionCard from './QuestionCard/QuestionCard';
import { useSecurityLockdown } from './hook/useSecurityLockDown';

const OngoingLiveExam = ({
	initialExamId,
	initialExamAttemptId,
	initialProctoringId,
	initialDurationTime,
}: IOngoingLiveExamProps) => {
	const router = useRouter();
	const { user } = useAuth();
	// States
	const [examId, setExamId] = useState<string>(initialExamId);
	const [examAttemptId, setExamAttemptId] =
		useState<string>(initialExamAttemptId);
	const [initialtimeAllowed, setInitialTimeAllowed] = useState<number>(
		Number(initialDurationTime),
	);
	const [examMeta, setExamMeta] = useState<IDBExamMeta | null>(null);

	const [answers, setAnswers] = useState<Record<string, IDBExamAnswer>>({});
	const [timeLeft, setTimeLeft] = useState<number>(initialtimeAllowed);

	const [violations, setViolations] = useState<TViolation[]>([]);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(
		!!document.fullscreenElement,
	); // Track fullscreen status
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [restartProctoring, setRestartProctoring] = useState(false);
	const [showViolationModal, setShowViolationModal] = useState(false);

	const [questions, setQuestions] = useState<IDBExamQuestion[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [faceDetectionStatus, setFaceDetectionStatus] = useState<
		'detected' | 'not_detected' | 'multiple_faces'
	>('detected');

	const [showScreenShareModal, setShowScreenShareModal] =
		useState<boolean>(false);
	const [screenStreamActive, setScreenStreamActive] = useState(true);

	const videoRef = useRef<HTMLVideoElement | null>(null);

	const proctorRef = useRef<ProctoringController | null>(null);

	const evidenceIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const submittingRef = useRef<boolean>(false);

	const examLocked = !screenStreamActive || isSubmitted;

	// const { allQuestions, error, loading } = useFetchExamQuestions(
	// 	examId,
	// 	examAttemptId,
	// );
	useEffect(() => {
		const fetchExamsQuestions = async () => {
			const maxRetries = 3;
			const baseDelay = 1000;

			const existingQuestions = await DBExamRepository.getExamQuestions(examId);
			console.log('existingQuestions: ', existingQuestions);
			if (existingQuestions && (existingQuestions?.length ?? 0) > 0) {
				setQuestions(existingQuestions);
				setLoading(false);
				return;
			}

			for (let attempt = 0; attempt < maxRetries; attempt++) {
				try {
					const response = await fetch(
						`/api/v1/exams/students/live/questions?examId=${examId}&examAttemptId=${examAttemptId}`,
						{
							method: 'GET',
							credentials: 'include',
						},
					);
					const data = await response.json();
					if (!response.ok || !data?.success) {
						setError(data.message);
						toast.error(data.message);
						return;
					}
					const questionData = data.data;
					console.log('questionData before setting to state: ', questionData);
					console.log('setting questions to state...');
					setQuestions(
						(questionData ?? []).map((q: any) => {
							return { ...q, attemptId: examAttemptId };
						}),
					);
					// length
					console.log('saving questions to DB...');
					await DBExamRepository.saveExamQuestions(questionData ?? []);
					setLoading(false);
				} catch (error) {
					toast.warn(`Attempt ${attempt + 1} failed for fetching questions`);
					if (attempt === maxRetries - 1) {
						toast.error(
							`Failed to save answer for fetching questions after ${maxRetries} attempts. error: ${JSON.stringify(error)}`,
						);
						setLoading(false);
						return;
					}
					// Wait before retrying. Exponential backoff: 1s, 2s, 4s
					const delay = baseDelay * Math.pow(2, attempt);
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		};

		fetchExamsQuestions();
	}, [examId, examAttemptId]);

	const { sendEvidence, sendViolation } = useProctoringSocket();

	useEffect(() => {
		const loadAnswers = async () => {
			const answers = await DBExamRepository.getExamAnswers(examId);
			if ((answers?.length ?? 0) > 0) {
				const recoveredAnswers = answers.reduce(
					(acc, answer) => {
						acc[answer.questionId] = answer;
						return acc;
					},
					{} as Record<string, IDBExamAnswer>,
				);

				setAnswers(recoveredAnswers);
			} else {
				// TODO: GET /exam-attempts/:attemptId/answers from backend
			}
		};
		loadAnswers();
	}, [examId]);

	// SET INITIAL TIME
	useEffect(() => {
		const getExamMeta = async () => {
			const examMeta = await DBExamRepository.getExamMeta(examId);
			const examAttempt = await DBExamRepository.getExamToken(examId, user!.id);
			if (!examMeta) return;
			setInitialTimeAllowed(Number(examMeta.duration.Total) * 60);
			setExamMeta(examMeta);

			if (!examAttemptId && examAttempt) {
				setExamAttemptId(examAttempt.examAttemptId);
			}

			// TODO: Call backend Check for exam status here returns { submitted: boolean; ended: boolean }
		};

		getExamMeta();
	}, [examAttemptId, examId, user]);

	// Start/COntinue timer
	useEffect(() => {
		if (isSubmitted) return;

		let timer: NodeJS.Timeout;

		const startTimer = async () => {
			const examMeta = await DBExamRepository.getExamMeta(examId);

			if (!examMeta?.startTime) return;

			const durationMs = Number(examMeta.duration.Total) * 60 * 1000;

			const endTimeMs = examMeta.startTime + durationMs;

			const tick = () => {
				const remainingSeconds = Math.max(
					Math.floor((endTimeMs - Date.now()) / 1000),
					0,
				);

				setTimeLeft(remainingSeconds);

				if (remainingSeconds <= 0) {
					clearInterval(timer);
				}
			};

			tick();

			timer = setInterval(tick, 1000);
		};

		startTimer();

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [examId, isSubmitted]);

	// Monitor Fullscreen Status
	useEffect(() => {
		const handleFullScreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener('fullscreenchange', handleFullScreenChange);
		return () =>
			document.removeEventListener('fullscreenchange', handleFullScreenChange);
	}, []);

	// locked-down efffect
	useSecurityLockdown();

	const handleScreenShot = async () => {
		try {
			if (!proctorRef.current) return;

			const [cameraSnap, screenSnap] = await Promise.all([
				proctorRef.current.captureFrame(CameraType.CAMERA),
				proctorRef.current.captureFrame(CameraType.SCREEN),
			]);

			if (!cameraSnap && !screenSnap) return;

			sendEvidence({
				camera: cameraSnap,
				screen: screenSnap,
				timestamp: Date.now(),
				examAttemptId,
			});
			console.log('Evidence synced to backend.');
		} catch (error) {
			console.error('Failed to sync proctoring evidence', error);
		}
	};

	useEffect(() => {
		if (restartProctoring) return;
		const startProctoringTimer = () => {
			return setTimeout(() => {
				setRestartProctoring(true);
			}, 4000);
		};

		startProctoringTimer();

		return () => clearTimeout(startProctoringTimer());
	}, [restartProctoring]);

	useEffect(() => {
		let isActive = true;

		if (!restartProctoring) return;

		const initializeProctoring = async () => {
			try {
				proctorRef.current = new ProctoringController({
					requireFullscreen: true,
					requireCamera: true,
					requireScreenShare: true,
					faceDetectionConfig: {
						minConfidence: 0.5,
						detectionInterval: 800,
						noFaceGracePeriod: 3000,
						requireCentered: true,
						maxConsecutiveNoFace: 5,
					},
					onViolation: async (v) => {
						if (!isActive) return;

						await new Promise((resolve) => setTimeout(resolve, 2000));

						setViolations((prev) => {
							const isDuplicate = prev.some(
								(p) =>
									p.type === v.type &&
									Math.abs(p.timestamp - v.timestamp) < 5000,
							);
							return isDuplicate ? prev : [...prev, v];
						});

						switch (v.type) {
							case ProctoringViolationEnum.NO_FACE:
								toast.warning('Please ensure your face is visible', {
									autoClose: 3000,
								});
								setFaceDetectionStatus('not_detected');
								sendViolation({
									metadata: {},
									severity: 1,
									timestamp: Date.now(),
									type: ProctoringViolationEnum.NO_FACE,
									examAttemptId,
									proctoringSessionId: initialProctoringId,
								});
								break;
							case ProctoringViolationEnum.MULTIPLE_FACES:
								toast.error('Multiple faces detected - this is not allowed', {
									autoClose: 5000,
								});
								setFaceDetectionStatus('multiple_faces');
								sendViolation({
									metadata: {},
									severity: 1,
									timestamp: Date.now(),
									type: ProctoringViolationEnum.MULTIPLE_FACES,
									examAttemptId,
									proctoringSessionId: initialProctoringId,
								});
								break;
							case ProctoringViolationEnum.EXIT_FULLSCREEN:
								toast.warn('Please return to fullscreen mode', {
									autoClose: false,
								});
								sendViolation({
									metadata: {},
									severity: 1,
									timestamp: Date.now(),
									type: ProctoringViolationEnum.EXIT_FULLSCREEN,
									examAttemptId,
									proctoringSessionId: initialProctoringId,
								});
								break;
							case ProctoringViolationEnum.TAB_SWITCH:
								toast.error('Tab switching is a critical violation!', {
									position: 'top-center',
									autoClose: false,
								});
								sendViolation({
									metadata: {},
									severity: 1,
									timestamp: Date.now(),
									type: ProctoringViolationEnum.TAB_SWITCH,
									examAttemptId,
									proctoringSessionId: initialProctoringId,
								});
								break;
							case ProctoringViolationEnum.DEVTOOLS_SUSPECTED:
								toast.warning(
									'Developer tools detected - this may be flagged',
									{
										autoClose: 4000,
									},
								);
								sendViolation({
									metadata: {},
									severity: 1,
									timestamp: Date.now(),
									type: ProctoringViolationEnum.DEVTOOLS_SUSPECTED,
									examAttemptId,
									proctoringSessionId: initialProctoringId,
								});
								break;
							default:
								toast.info(`Violation: ${v.type.replaceAll('_', ' ')}`);
						}
					},
					onFaceStatusChange(faceDetected) {
						setFaceDetectionStatus(faceDetected ? 'detected' : 'not_detected');
						setShowViolationModal(faceDetected ? false : true);
					},
					onScreenShareStopped: () => {
						if (!showScreenShareModal) setShowScreenShareModal(true);
						if (screenStreamActive) setScreenStreamActive(false);
						// setShowScreenShareModal(true);
						// setScreenStreamActive(false);
					},
					onScreenShareResumed: () => {
						if (showScreenShareModal) setShowScreenShareModal(false);
						if (!screenStreamActive) setScreenStreamActive(true);
						// setShowScreenShareModal(false);
						// setScreenStreamActive(true);
					},
				});

				// Start proctoring
				await proctorRef.current?.start();
				const stream = proctorRef.current.getCameraStream();
				if (videoRef.current && stream) {
					videoRef.current.srcObject = stream;
				}

				evidenceIntervalRef.current = setInterval(async () => {
					if (isActive && proctorRef.current) {
						await handleScreenShot();
						toast.info('Captured screen shot');
					}
				}, 60000); // Capture evidence every 60 seconds
				// TODO: maybe make the timing random

				return () => {
					isActive = false;

					if (evidenceIntervalRef.current) {
						clearInterval(evidenceIntervalRef.current);
						evidenceIntervalRef.current = null;
					}

					if (proctorRef.current) {
						proctorRef.current.stop();
						proctorRef.current = null;
					}
				};
			} catch (err) {
				console.error('Failed to start proctoring:', err);
				setRestartProctoring(false);
				toast.error(
					`Proctoring system failed to start. Please contact support.`,
				);
			}
		};

		initializeProctoring();

		return () => {
			isActive = false;
			if (proctorRef.current) {
				proctorRef.current.stop();
				proctorRef.current = null;
			}
		};
	}, [restartProctoring]);

	const handleReEnterFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
			}
		} catch (err) {
			toast.error('Please enable fullscreen to continue.');
		}
	};

	const handleResumeScreenShare = async () => {
		try {
			if (!proctorRef?.current) return;
			await proctorRef.current.startScreenShare();
			setShowScreenShareModal(false);
		} catch (err) {
			alert('Screen sharing is required to continue.');
		}
	};

	const answeredCount = (
		Object.keys(answers).filter((id) => !!answers[id]) ?? []
	).length;
	const progressPercentage = (questions ?? []).length
		? (answeredCount / (questions ?? []).length) * 100
		: 0;

	const handleMCQInputChange = async (
		questionId: string,
		value: IDBExamQuestionOption,
	) => {
		const answer = {
			attemptId: examAttemptId,
			examId,
			synced: DBExamAnswerSyncEnum.PENDING,
			updatedAt: new Date().getTime(),
			questionId,
			answerText: value.optionText,
			optionId: value.id,
		};
		await handleAllAnswerTypeInputChange(answer);
	};

	const handleSHORTInputChange = async (questionId: string, value: string) => {
		const answer = {
			attemptId: examAttemptId,
			examId,
			synced: DBExamAnswerSyncEnum.PENDING,
			updatedAt: new Date().getTime(),
			questionId: questionId,
			answerText: value,
			optionId: undefined,
		};
		await handleAllAnswerTypeInputChange(answer);
	};

	const handleAllAnswerTypeInputChange = async (answer: IDBExamAnswer) => {
		const maxRetries = 3;
		const baseDelay = 1000;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				await DBExamRepository.saveExamAnswers(answer);
				setAnswers((prev) => ({
					...prev,
					[answer.questionId]: {
						...answer,
						synced: DBExamAnswerSyncEnum.SYNCED,
					},
				}));
				return;
			} catch (error) {
				toast.warn(
					`Attempt ${attempt + 1} failed for question ${answer.questionId}: ${JSON.stringify(error)}`,
				);
				if (attempt === maxRetries - 1) {
					toast.error(
						`Failed to save answer for ${answer.questionId} after ${maxRetries} attempts. error: ${JSON.stringify(error)}`,
					);
					return;
				}
				// Wait before retrying. Exponential backoff: 1s, 2s, 4s
				const delay = baseDelay * Math.pow(2, attempt);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	};

	const handleSubmit = async () => {
		try {
			// Capture final evidence before submission
			await handleScreenShot();
			const submitted = await handleBackendAnswerSync(true);
			if (!submitted) {
				submittingRef.current = false;
				toast.error('Could not complete Exam submittion. Please try again.');
				return;
			}

			proctorRef.current?.stop();
			setIsSubmitted(true);

			toast.success('Exam submitted successfully!');
		} catch (error) {
			console.error('Error submitting exam:', error);
			toast.error('Failed to submit exam. Please try again.');
		}
	};

	const handleBackendAnswerSync = async (submit: boolean) => {
		try {
			const pendingDbAnswers = await DBExamRepository.getExamAnswers(
				examId,
				DBExamAnswerSyncEnum.PENDING,
			);

			// Map DB answers by questionId
			const pendingDbMap = new Map(
				pendingDbAnswers.map((answer) => [answer.questionId, answer]),
			);

			// Include memory answers only if:
			// they don't exist in pending DB
			// OR
			// they are newer than DB version
			const unsavedMemoryAnswers = Object.values(answers).filter(
				(memoryAnswer) => {
					const dbAnswer = pendingDbMap.get(memoryAnswer.questionId);

					if (!dbAnswer) {
						return true;
					}

					return memoryAnswer.updatedAt > dbAnswer.updatedAt; // check for stale answers(incase of unsaved changes when answers change)
				},
			);

			// If memory version is newer, replace DB version
			const mergedAnswersMap = new Map<string, IDBExamAnswer>();

			pendingDbAnswers.forEach((answer) => {
				mergedAnswersMap.set(answer.questionId, answer);
			});

			unsavedMemoryAnswers.forEach((answer) => {
				mergedAnswersMap.set(answer.questionId, answer);
			});

			const answersForBackend = Array.from(mergedAnswersMap.values());

			if (answersForBackend.length < 1 && !submit) {
				return true;
			}

			const response = await fetch(`/api/v1/exams/students/live/answers`, {
				method: 'POST',
				body: JSON.stringify({
					examId,
					examAttemptId,
					submit,
					answers: answersForBackend.map((answer) => {
						return {
							questionId: answer.questionId,
							optionId: answer.optionId ?? null,
							answerText: answer.answerText ?? null,
							updatedAt: answer.updatedAt,
						};
					}),
				}),
				credentials: 'include',
			});

			const data = await response.json();
			if (data.success) {
				await DBExamRepository.updateExamAnswerSynced(
					answersForBackend,
					DBExamAnswerSyncEnum.SYNCED,
				);
				if (submit) {
					await DBExamRepository.updateExamAsSubmitted(examId);
					await DBExamRepository.clearExamData(examId);
				}
				return true;
			}
			return false;
		} catch (error) {
			console.error('Error syncing exam answers:', error);
			return false;
		}
	};

	// periodic sync for answers
	useEffect(() => {
		let cancelled = false;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		const getNextDelay = (minMinutes: number) => {
			// Add a random offset between 0 and 5 minutes (300,000ms)
			// This ensures the total delay is between 5 and 10 minutes
			const jitter = Math.random() * 5 * 60 * 1000;
			return minMinutes * 60 * 1000 + jitter;
		};

		const peridicSync = async () => {
			if (cancelled) return;

			try {
				await handleBackendAnswerSync(false);
			} catch (error) {
				console.log('could not sync exam answers: ', error);
			}

			if (!cancelled) {
				const delay = getNextDelay(5);
				timeoutId = setTimeout(peridicSync, delay);
			}
		};

		timeoutId = setTimeout(peridicSync, getNextDelay(5));

		return () => {
			cancelled = true;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, []);

	useEffect(() => {
		if (submittingRef.current) return;

		submittingRef.current = true;
		if (timeLeft <= 0 && !isSubmitted) {
			handleSubmit();
		}
	}, [timeLeft, isSubmitted]);

	if (isSubmitted) {
		return (
			<ExamSummary
				questions={questions}
				answers={answers}
				violations={violations}
				timeSpent={formatTime(initialtimeAllowed - timeLeft)}
				onClose={() => router.push(ProtectedRouteEnum.STUDENTS)}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F9FB] pb-24 select-none flex flex-col md:flex-row">
			<aside className="fixed bottom-4 right-4 md:top-24 md:left-4 z-40 w-48 md:w-56 space-y-4">
				{/* Live Camera Feed */}
				<ExamLiveCameraFeed
					faceDetectionStatus={faceDetectionStatus}
					videoRef={videoRef}
				/>
				{/* Status Dashboard */}
				<ExamStatusDashboard violations={violations} />
			</aside>

			{!isFullscreen && (
				<ResumeFullScreenModal onReEnterFullscreen={handleReEnterFullscreen} />
			)}

			<main
				className={`flex-1 transition-all duration-300 ${!isFullscreen ? 'blur-2xl' : ''}`}
			>
				{/* STICKY PROGRESS HEADER */}
				<StickyProgressHeader
					answeredCount={answeredCount}
					progressPercentage={progressPercentage}
					questions={questions}
					timeLeft={timeLeft}
				/>

				<div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
					{/* Exam Title & Stats */}
					{/* Guidelines */}
					<ExamTitleStatsGuidlines
						examTitle={examMeta?.examTitle}
						fullMarksTotal={examMeta?.fullMarks?.Total}
						examDurationTotal={examMeta?.duration?.Total}
					/>

					{/* Questions Area */}
					<div className="space-y-8">
						{loading && (
							<div className="text-center mb-8">Preparing Exam Questions</div>
						)}
						{error && (
							<div className="text-center mb-8 text-red-600">
								Error Occurred while preparing Exam Questions
							</div>
						)}
						{questions?.map((question) => {
							return (
								<QuestionCard
									key={question.id}
									answers={answers}
									onSHORTInputChange={handleSHORTInputChange}
									onMCQInputChange={handleMCQInputChange}
									question={question}
								/>
							);
						})}
					</div>

					{/* Submit Action */}
					<div className="flex justify-center pt-10">
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
							onClick={handleSubmit}
							disabled={examLocked || loading || !!error}
						>
							Finalize and Submit
						</button>
					</div>
				</div>

				{showViolationModal && <ViolaTionModal violations={violations} />}
				{showScreenShareModal && (
					<ScreenShareModal
						onScreenShareResume={handleResumeScreenShare}
						violations={violations}
					/>
				)}
			</main>
		</div>
	);
};

export default OngoingLiveExam;

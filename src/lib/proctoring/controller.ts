import {
	CameraType,
	ProctoringOptions,
	TCameraTypeValue,
	Violation,
	ViolationType,
} from './interface';

export class ProctoringController {
	private violations: Violation[] = [];
	private isActive = false;

	private cameraStream: MediaStream | null = null;
	private screenStream: MediaStream | null = null;

	private micStream: MediaStream | null = null;
	private audioContext: AudioContext | null = null;
	private analyser: AnalyserNode | null = null;
	private micInterval: number | null = null;

	private faceDetector: any = null;
	public faceDetected = false;
	private faceInterval: number | null = null;
	private videoElement: HTMLVideoElement | null = null;

	private devtoolsInterval: number | null = null;

	private options: ProctoringOptions;

	constructor(options: ProctoringOptions = {}) {
		this.options = {
			requireFullscreen: true,
			requireCamera: false,
			requireScreenShare: false,
			...options,
		};
	}

	async start() {
		if (this.isActive) {
			this.logViolation('MULTIPLE_START_ATTEMPT');
			return;
		}

		this.isActive = true;

		await this.startMicrophone();

		if (this.options.requireFullscreen) {
			await this.enterFullscreen();

			this.attachFullscreenMonitor();
		}

		this.attachTabMonitor();

		this.startDevtoolsDetection();

		if (this.options.requireCamera) {
			await this.startCamera();
			await this.startFaceDetection();
		}

		if (this.options.requireScreenShare) {
			await this.startScreenShare();
		}
	}

	async stop() {
		this.isActive = false;

		this.detachTabMonitor();
		this.detachFullscreenMonitor();

		if (this.cameraStream) {
			this.cameraStream.getTracks().forEach((t) => t.stop());
			this.cameraStream = null;
		}

		if (this.screenStream) {
			this.screenStream.getTracks().forEach((t) => t.stop());
			this.screenStream = null;
		}

		if (document.fullscreenElement) {
			await document.exitFullscreen();
		}

		if (this.micInterval) {
			clearInterval(this.micInterval);
		}

		if (this.micStream) {
			this.micStream.getTracks().forEach((t) => t.stop());
		}

		if (this.faceInterval) {
			clearInterval(this.faceInterval);
		}

		if (this.devtoolsInterval) {
			clearInterval(this.devtoolsInterval);
		}
	}

	getViolations() {
		return [...this.violations];
	}

	clearViolations() {
		this.violations = [];
	}

	/**
	 * Periodically takes screenshot of camera and screen
	 * @returns
	 */
	async captureFrame(type: TCameraTypeValue): Promise<string | null> {
		const stream =
			type === CameraType.CAMERA ? this.cameraStream : this.screenStream;
		if (!stream) return null;

		const video = document.createElement('video');
		video.srcObject = stream;
		await video.play();

		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext('2d');
		ctx?.drawImage(video, 0, 0);

		// 0.7 quality keeps file sizes small for the backend
		return canvas.toDataURL('image/jpeg', 0.7);
	}

	private async startFaceDetection() {
		if (!this.cameraStream) return;

		this.videoElement = document.createElement('video');
		this.videoElement.srcObject = this.cameraStream;
		await this.videoElement.play();

		const { FaceDetection } = await import('@mediapipe/face_detection');

		this.faceDetector = new FaceDetection({
			locateFile: (file: string) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
		});

		this.faceDetector.setOptions({
			model: 'short',
			minDetectionConfidence: 0.5,
		});

		this.faceDetector.onResults((results: any) => {
			if (!this.isActive) return;

			const faces = results.detections?.length || 0;

			if (faces === 0) {
				this.logViolation('NO_FACE');
				this.faceDetected = false;
			}
			if (faces === 1) {
				this.faceDetected = true;
			}

			if (faces > 1) {
				this.logViolation('MULTIPLE_FACES', { count: faces });
				this.faceDetected = false;
			}
		});

		this.faceInterval = window.setInterval(async () => {
			if (!this.videoElement) return;

			await this.faceDetector.send({
				image: this.videoElement,
			});
		}, 1500);
	}

	private startDevtoolsDetection() {
		const threshold = 160;

		this.devtoolsInterval = window.setInterval(() => {
			if (!this.isActive) return;

			const widthDiff = window.outerWidth - window.innerWidth;
			const heightDiff = window.outerHeight - window.innerHeight;

			if (widthDiff > threshold || heightDiff > threshold) {
				this.logViolation('DEVTOOLS_SUSPECTED', {
					widthDiff,
					heightDiff,
				});
			}
		}, 2000);
	}

	private async startMicrophone() {
		try {
			this.micStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			this.audioContext = new AudioContext();
			const source = this.audioContext.createMediaStreamSource(this.micStream);
			this.analyser = this.audioContext.createAnalyser();

			source.connect(this.analyser);

			const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

			this.micInterval = window.setInterval(() => {
				if (!this.isActive || !this.analyser) return;

				this.analyser.getByteFrequencyData(dataArray);

				const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

				if (average > 60) {
					this.logViolation('VOICE_DETECTED', { level: average });
				}
			}, 2000);
		} catch {
			this.logViolation('VOICE_DETECTED', { reason: 'mic_permission_denied' });
		}
	}

	// Violation Logging
	private logViolation(type: ViolationType, metadata?: any) {
		const violation: Violation = {
			type,
			timestamp: Date.now(),
			metadata,
		};

		this.violations.push(violation);

		if (this.options.onViolation) {
			this.options.onViolation(violation);
		}

		console.warn('[PROCTORING]', violation);
	}

	// Tab Monitoring
	private handleVisibilityCHange = () => {
		if (!this.isActive) return;

		if (document.hidden) {
			this.logViolation('TAB_SWITCH');
		}
	};

	private attachTabMonitor() {
		document.addEventListener('visibilitychange', this.handleVisibilityCHange);
	}

	private detachTabMonitor() {
		document.removeEventListener(
			'visibilitychange',
			this.handleVisibilityCHange,
		);
	}

	// Fullscreen Monitoring

	private async enterFullscreen() {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
		}
	}

	private handleFullscreenChange = () => {
		if (!this.isActive) return;

		if (!document.fullscreenElement) {
			this.logViolation('EXIT_FULLSCREEN');
		}
	};

	private attachFullscreenMonitor() {
		document.addEventListener('fullscreenchange', this.handleFullscreenChange);
	}

	private detachFullscreenMonitor() {
		document.removeEventListener(
			'fullscreenchange',
			this.handleFullscreenChange,
		);
	}

	// Camera Monitoring
	private async startCamera() {
		try {
			this.cameraStream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});

			const track = this.cameraStream.getVideoTracks()[0];

			track.onended = () => {
				if (this.isActive) {
					this.logViolation('CAMERA_STOPPED');
				}
			};
		} catch (error) {
			this.logViolation('CAMERA_STOPPED', { reason: 'permission_denied' });
		}
	}

	// Screen Share Monitoring
	private async startScreenShare() {
		try {
			this.screenStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
			});

			const track = this.screenStream.getVideoTracks()[0];

			track.onended = () => {
				if (this.isActive) {
					this.logViolation('SCREEN_SHARE_STOPPED');
				}
			};
		} catch (error) {
			this.logViolation('SCREEN_SHARE_STOPPED', {
				reason: 'permission_denied',
			});
		}
	}
}

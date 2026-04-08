export type ViolationType =
	| 'TAB_SWITCH'
	| 'EXIT_FULLSCREEN'
	| 'CAMERA_STOPPED'
	| 'SCREEN_SHARE_STOPPED'
	| 'MULTIPLE_START_ATTEMPT'
	| 'VOICE_DETECTED'
	| 'MULTIPLE_FACES'
	| 'NO_FACE'
	| 'FACE_NOT_CENTERED'
	| 'DEVTOOLS_SUSPECTED'
	| 'FACE_DETECTION_ERROR';

export type Violation = {
	type: ViolationType;
	timestamp: number;
	metadata?: Record<string, any>;
};

export type ProctoringOptions = {
	requireFullscreen?: boolean;
	requireCamera?: boolean;
	requireScreenShare?: boolean;
	faceDetectionConfig?: {
		minConfidence?: number;
		detectionInterval?: number;
		noFaceGracePeriod?: number;
		requireCentered?: boolean;
		maxConsecutiveNoFace?: number;
	};
	onViolation?: (violation: Violation) => void;
	onFaceStatusChange?: (detected: boolean) => void;
	onScreenShareStopped?: () => void;
	onScreenShareResumed?: () => void;
};

export const CameraType = Object.freeze({
	CAMERA: 'camera',
	SCREEN: 'ascreen',
});

export type TCameraTypeValue = (typeof CameraType)[keyof typeof CameraType];

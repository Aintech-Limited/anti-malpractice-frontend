export const ProctoringViolationEnum = Object.freeze({
	TAB_SWITCH: 'TAB_SWITCH',
	EXIT_FULLSCREEN: 'EXIT_FULLSCREEN',
	CAMERA_STOPPED: 'CAMERA_STOPPED',
	SCREEN_SHARE_STOPPED: 'SCREEN_SHARE_STOPPED',
	MULTIPLE_START_ATTEMPT: 'MULTIPLE_START_ATTEMPT',
	VOICE_DETECTED: 'VOICE_DETECTED',
	MULTIPLE_FACES: 'MULTIPLE_FACES',
	NO_FACE: 'NO_FACE',
	FACE_NOT_CENTERED: 'FACE_NOT_CENTERED',
	DEVTOOLS_SUSPECTED: 'DEVTOOLS_SUSPECTED',
	FACE_DETECTION_ERROR: 'FACE_DETECTION_ERROR',
});

export type ViolationEnumKey = keyof typeof ProctoringViolationEnum;

export type TViolationType = (typeof ProctoringViolationEnum)[ViolationEnumKey];

export type TViolation = {
	type: TViolationType;
	timestamp: number;
	metadata?: Record<string, any>;
};

export type TProctoringOptions = {
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
	onViolation?: (violation: TViolation) => void;
	onFaceStatusChange?: (detected: boolean) => void;
	onScreenShareStopped?: () => void;
	onScreenShareResumed?: () => void;
};

export const CameraType = Object.freeze({
	CAMERA: 'camera',
	SCREEN: 'ascreen',
});

export type TCameraTypeValue = (typeof CameraType)[keyof typeof CameraType];

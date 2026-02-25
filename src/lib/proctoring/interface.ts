export type ViolationType =
	| 'TAB_SWITCH'
	| 'EXIT_FULLSCREEN'
	| 'CAMERA_STOPPED'
	| 'SCREEN_SHARE_STOPPED'
	| 'MULTIPLE_START_ATTEMPT'
	| 'VOICE_DETECTED'
	| 'MULTIPLE_FACES'
	| 'NO_FACE'
	| 'DEVTOOLS_SUSPECTED';

export type Violation = {
	type: ViolationType;
	timestamp: number;
	metadata?: Record<string, any>;
};

export type ProctoringOptions = {
	requireFullscreen?: boolean;
	requireCamera?: boolean;
	requireScreenShare?: boolean;
	onViolation?: (violation: Violation) => void;
};

export const CameraType = Object.freeze({
	CAMERA: 'camera',
	SCREEN: 'ascreen',
});

export type TCameraTypeValue = (typeof CameraType)[keyof typeof CameraType];

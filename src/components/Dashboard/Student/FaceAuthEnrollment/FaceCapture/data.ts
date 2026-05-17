import { EnrollmentStep } from './interface';

export const enrollmentSteps: EnrollmentStep[] = [
	{
		id: 'instructions',
		title: 'Face Authentication Setup',
		description:
			"We'll capture your face to enable secure login. Make sure you have good lighting and face the camera directly.",
	},
	{
		id: 'camera',
		title: 'Camera Setup',
		description: 'Allow camera access and position your face in the frame.',
	},
	{
		id: 'capture',
		title: 'Capture Your Face',
		description: 'Hold still while we capture your face image.',
	},
	{
		id: 'processing',
		title: 'Processing',
		description: "We're analyzing your face and creating a secure template.",
	},
	{
		id: 'success',
		title: 'Enrollment Successful',
		description: 'Your face authentication has been set up successfully.',
	},
	{
		id: 'error',
		title: 'Enrollment Failed',
		description: 'There was an error setting up face authentication.',
	},
];

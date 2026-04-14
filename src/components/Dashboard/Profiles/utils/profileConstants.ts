import { Shield, Fingerprint, Clock, Globe, CheckCircle } from 'lucide-react';

export const GENDER_OPTIONS = [
	{ value: 'MALE', label: 'Male' },
	{ value: 'FEMALE', label: 'Female' },
];

export const INFO_CARDS_CONFIG = [
	{ icon: Shield, label: 'Account Type', key: 'profileType' },
	{ icon: Globe, label: 'Role', key: 'role' },
	{ icon: Fingerprint, label: 'Face Auth', key: 'faceAuthEnabled' },
	{ icon: CheckCircle, label: 'ID Verified', key: 'isIdVerified' },
	{ icon: Clock, label: 'ID Recorded', key: 'idRecorded' },
] as const;

export const NOTIFICATION_DURATION = 5000;

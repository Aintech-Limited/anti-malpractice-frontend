export interface IFailureStateProps {
	error: string | null;
	onRetry: () => void;
}

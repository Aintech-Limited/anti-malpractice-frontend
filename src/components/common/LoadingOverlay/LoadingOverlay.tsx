const LoadingOverlay = ({ message }: { message: string }) => {
	return (
		<div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-3xl">
			<span className="text-5xl font-bold text-slate-500 animate-pulse">
				{message}...
			</span>
		</div>
	);
};

export default LoadingOverlay;

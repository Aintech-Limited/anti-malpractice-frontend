interface IAvatarUploaderProps {
	avatar?: string | null;
}

interface IUploadApiResponse {
	message: string;
	success: boolean;
	data: {
		publicId: string;
		url: string;
		fileSize: string;
	};
}

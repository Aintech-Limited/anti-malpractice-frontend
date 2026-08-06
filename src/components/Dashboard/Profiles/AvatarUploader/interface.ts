export interface IAvatarUploaderProps {
  avatar?: string | null;
}

export interface IUploadApiResponse {
  message: string;
  success: boolean;
  data: {
    publicId: string;
    url: string;
    fileSize: string;
  };
}

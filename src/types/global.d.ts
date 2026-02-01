export {};

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}

	namespace NodeJS {
		interface ProcessEnv {
			// ===== Client (NEXT_PUBLIC) =====
			NEXT_PUBLIC_URL: string;
			NEXT_PUBLIC_GOOGLE_CLIENT_KEY: string;
			NEXT_PUBLIC_NEXTAUTH_URL: string;
			NEXT_PUBLIC_OTP_EXPIRY: string;

			// ===== Server Only =====
			AUTH_TOKEN_NAME: string;
			AUTH_REFRESH_TOKEN_NAME: string;
			BACKEND_API_URL: string;
			PORT: string;
			NODE_ENV: 'development' | 'staging' | 'test' | 'production';
			NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: string;

			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
		}
	}
}

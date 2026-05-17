export {};

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}

	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_APP_URL: string;
			NEXT_PUBLIC_OTP_EXPIRY: string;
			NEXT_PUBLIC_WS_URL: string;
			NEXT_PUBLIC_ADMIN_EMAIL: string;

			NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: string;
			NEXTAUTH_URL: string;
			NEXTAUTH_SECRET: string;

			AUTH_TOKEN_NAME: string;
			AUTH_REFRESH_TOKEN_NAME: string;
			BACKEND_API_URL: string;

			PORT: string;
			NODE_ENV: 'development' | 'staging' | 'test' | 'production';

			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;

			FLUTTERWAVE_SECRET_KEY: string;
			FLUTTERWAVE_RESOLVE_URL: string;
		}
	}
}

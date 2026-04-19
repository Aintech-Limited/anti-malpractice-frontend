'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../providers/auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { persistor, store } from '@/src/redux/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AuthProvider>
					<SessionProvider>
						{children}
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar={false}
							closeOnClick={true}
							pauseOnHover={true}
						/>
					</SessionProvider>
				</AuthProvider>
			</PersistGate>
		</Provider>
	);
}

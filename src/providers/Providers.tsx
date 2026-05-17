'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { persistor, store } from '@/src/redux/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
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
			</PersistGate>
		</Provider>
	);
}

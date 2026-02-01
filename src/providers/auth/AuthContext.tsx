'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContextType } from './interface';
import { IUserModel } from '../../components/SignUp/interface';

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState<IUserModel | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const aintechUser = localStorage.getItem('aintechUser');
			if (aintechUser && aintechUser !== 'undefined') {
				setUser(JSON.parse(aintechUser));
			}
		} catch (error) {
			console.error('Failed to parse aintechUser:', error);
			localStorage.removeItem('aintechUser');
		}
		setLoading(false);
	}, []);

	const signIn = (userData: IUserModel) => {
		setUser(userData);
		localStorage.setItem('aintechUser', JSON.stringify(userData));
	};

	const signOut = () => {
		setUser(null);
		localStorage.removeItem('aintechUser');
	};

	const updateUser = (userData: Partial<IUserModel>) => {
		if (user) {
			const updatedUser = { ...user, ...userData };
			setUser(updatedUser);
			localStorage.setItem('aintechUser', JSON.stringify(updatedUser));
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, signIn, loading, signOut, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};

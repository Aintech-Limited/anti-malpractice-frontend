'use lient';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { IWSViolationData } from './interface';

export const useProctoringSocket = (token: string) => {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		// Initialize connection
		socketRef.current = io(`${process.env.NEXT_PUBLIC_WS_URL}/proctoring`, {
			auth: { token },
			transports: ['websocket'],
		});

		socketRef.current.on('connect', () => {
			console.log('Connected to proctoring namespace');
		});

		socketRef.current.on('connect_error', (err: Error) => {
			console.error('Connection failed:', err.message);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [token]);

	const sendViolation = (data: IWSViolationData) => {
		socketRef.current?.emit('violation', data);
	};
	const sendEvidence = (type: 'camera' | 'screen', image: string) => {
		socketRef.current?.emit('violation', { type, image });
	};

	return { sendViolation, sendEvidence };
};

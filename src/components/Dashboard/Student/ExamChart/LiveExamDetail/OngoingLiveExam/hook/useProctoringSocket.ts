'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { IWSProctoringEvidenceData, IWSViolationData } from './interface';

export const useProctoringSocket = () => {
	const socketRef = useRef<Socket | null>(null);
	const queueRef = useRef<
		{
			event: 'violation' | 'evidence';
			violationPayload?: IWSViolationData;
			evidencePayload?: IWSProctoringEvidenceData;
		}[]
	>([]);

	useEffect(() => {
		socketRef.current = io(`${process.env.NEXT_PUBLIC_WS_URL}/proctoring`, {
			transports: ['websocket'],
			withCredentials: true,
		});

		socketRef.current.on('connect', () => {
			console.log('Connected to proctoring namespace');
			queueRef.current
				.filter((queue) => queue.event === 'violation')
				.forEach((item) => {
					socketRef.current?.emit(item.event, item.violationPayload);
				});
			// queueRef.current
			// 	.filter((queue) => queue.event === 'evidence')
			// 	.forEach((item) => {
			// 		socketRef.current?.emit(item.event, item.evidencePayload);
			// 	}); TODO: uncomment later
			queueRef.current = [];
		});

		socketRef.current.on('connect_error', (err: Error) => {
			console.error('Connection failed:', err.message);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, []);

	const sendViolation = (data: IWSViolationData) => {
		if (!socketRef.current?.connected) {
			queueRef.current.push({
				event: 'violation',
				violationPayload: data,
			});
			// TODO: Also save violations to DBExamRepository.saveExamViolation
			return;
		}
		socketRef.current?.emit('violation', data);
	};
	const sendEvidence = (data: IWSProctoringEvidenceData) => {
		console.log('sending proctoring evidence: ', data.timestamp);
		// if (!socketRef.current?.connected) return;
		// socketRef.current?.emit('violation', data);
	};

	return { sendViolation, sendEvidence };
};

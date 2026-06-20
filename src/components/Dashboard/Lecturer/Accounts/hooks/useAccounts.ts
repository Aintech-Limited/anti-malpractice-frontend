'use client';

import { useState, useEffect } from 'react';
import { IAccount, IFormData, INotification } from '../interface';

export function useAccounts(
	initialAccounts: IAccount[],
	initialHasPIN: boolean,
) {
	const [accounts, setAccounts] = useState<IAccount[]>(initialAccounts);
	const [hasPIN, setHasPIN] = useState(initialHasPIN);
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState<INotification | null>(null);

	const [showSetupPINModal, setShowSetupPINModal] = useState(!initialHasPIN);
	const [modalStage, setModalStage] = useState<
		| 'delete_account'
		| 'show_pin'
		| 'new_default'
		| 'change_pin'
		| 'verify_token'
		| ''
	>('');

	const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);
	const [pin, setPin] = useState(['', '', '', '']);
	const [newPIN, setNewPIN] = useState(['', '', '', '']);
	const [confirmPIN, setConfirmPIN] = useState(['', '', '', '']);
	const [token, setToken] = useState(['', '', '', '', '', '']);

	const [formData, setFormData] = useState<IFormData>({
		accountNumber: '',
		bankCode: '',
		bankName: '',
		accountName: '',
		pin: ['', '', '', ''],
	});

	const [verifyingAccount, setVerifyingAccount] = useState(false);

	useEffect(() => {
		if (notification) {
			const timer = setTimeout(() => setNotification(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [notification]);

	const showNotification = (type: 'success' | 'error', message: string) => {
		setNotification({ type, message });
	};

	const resetPINStates = () => {
		setPin(['', '', '', '']);
		setNewPIN(['', '', '', '']);
		setConfirmPIN(['', '', '', '']);
		setToken(['', '', '', '', '', '']);
	};

	const resetForm = () => {
		setFormData({
			accountNumber: '',
			bankCode: '',
			bankName: '',
			accountName: '',
			pin: ['', '', '', ''],
		});
		setVerifyingAccount(false);
	};

	return {
		// State
		accounts,
		hasPIN,
		loading,
		notification,
		showSetupPINModal,
		selectedAccount,
		pin,
		newPIN,
		confirmPIN,
		token,
		formData,
		verifyingAccount,
		modalStage,

		// Setters
		setAccounts,
		setHasPIN,
		setLoading,
		setShowSetupPINModal,
		setSelectedAccount,
		setPin,
		setNewPIN,
		setConfirmPIN,
		setToken,
		setFormData,
		setVerifyingAccount,
		setModalStage,

		// Actions
		showNotification,
		resetPINStates,
		resetForm,
	};
}

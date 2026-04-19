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
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showPINModal, setShowPINModal] = useState(false);
	const [showSetupPINModal, setShowSetupPINModal] = useState(!initialHasPIN);
	const [showChangePINModal, setShowChangePINModal] = useState(false);
	const [showVerifyTokenModal, setShowVerifyTokenModal] = useState(false);
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
		showDeleteModal,
		showPINModal,
		showSetupPINModal,
		showChangePINModal,
		showVerifyTokenModal,
		selectedAccount,
		pin,
		newPIN,
		confirmPIN,
		token,
		formData,
		verifyingAccount,

		// Setters
		setAccounts,
		setHasPIN,
		setLoading,
		setShowDeleteModal,
		setShowPINModal,
		setShowSetupPINModal,
		setShowChangePINModal,
		setShowVerifyTokenModal,
		setSelectedAccount,
		setPin,
		setNewPIN,
		setConfirmPIN,
		setToken,
		setFormData,
		setVerifyingAccount,

		// Actions
		showNotification,
		resetPINStates,
		resetForm,
	};
}

'use client';

import { toast } from 'react-toastify';
import AccountsHeader from './AccountsHeader/AccountsHeader';
import AccountsList from './AccountsList/AccountsList';
import AddAccountForm from './AddAccountForm/AddAccountForm';
import { useAccounts } from './hooks/useAccounts';
import { IAccountsProps } from './interface';
import ChangePINModal from './modals/ChangePINModal';
import DeleteAccountModal from './modals/DeleteAccountModal';
import SetupPINModal from './modals/SetupPINModal';
import VerifyTokenModal from './modals/VerifyTokenModal';
import NotificationToast from './NotificationToast/NotificationToast';

export default function Accounts({
	initialAccounts,
	hasPIN: initialHasPIN,
	banks,
}: IAccountsProps) {
	const {
		// State
		accounts,
		hasPIN,
		loading,
		notification,
		showDeleteModal,
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
	} = useAccounts(initialAccounts, initialHasPIN);

	const verifyAccount = async () => {
		if (!formData.accountNumber || !formData.bankCode) {
			showNotification('error', 'Please enter account number and select bank');
			return;
		}

		setVerifyingAccount(true);
		try {
			const response = await fetch('/api/v1/accounts/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					accountNumber: formData.accountNumber,
					bankCode: formData.bankCode,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				showNotification('error', data.message);
				toast.error(data.message);
			}

			if (data.success) {
				setFormData({
					...formData,
					accountName: data.data.accountName,
				});
				showNotification('success', 'Account verified successfully!');
			} else {
				showNotification('error', data.message || 'Failed to verify account');
			}
		} catch (error) {
			showNotification('error', 'Failed to verify account');
		} finally {
			setVerifyingAccount(false);
		}
	};

	const handleAddAccount = async (e: React.FormEvent) => {
		e.preventDefault();

		const pinString = formData.pin.join('');
		if (pinString.length !== 4) {
			showNotification('error', 'Please enter a valid 4-digit PIN');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/v1/accounts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					accountNumber: formData.accountNumber,
					bankCode: formData.bankCode,
					bankName: formData.bankName,
					accountName: formData.accountName,
					pin: pinString,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
				toast.error(data.message);
			}

			if (data.success) {
				setAccounts([...accounts, data.data]);
				resetForm();
				showNotification('success', 'Account added successfully!');
			} else {
				showNotification('error', data.message || 'Failed to add account');
			}
		} catch (error) {
			showNotification('error', 'Failed to add account');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!selectedAccount) return;

		const pinString = pin.join('');
		if (pinString.length !== 4) {
			showNotification('error', 'Please enter a valid 4-digit PIN');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(`/api/v1/accounts/${selectedAccount.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pin: pinString }),
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
				toast.error(data.message);
			}

			if (data || data.success) {
				setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
				setShowDeleteModal(false);
				resetPINStates();
				setSelectedAccount(null);
				showNotification('success', 'Account deleted successfully!');
			} else {
				showNotification('error', data.message || 'Failed to delete account');
			}
		} catch (error) {
			showNotification('error', 'Failed to delete account');
		} finally {
			setLoading(false);
		}
	};

	const handleSetupPIN = async () => {
		const newPINString = newPIN.join('');
		const confirmPINString = confirmPIN.join('');

		if (newPINString.length !== 4) {
			showNotification('error', 'Please enter a valid 4-digit PIN');
			return;
		}

		if (newPINString !== confirmPINString) {
			showNotification('error', 'PINs do not match');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/v1/accounts/pin/setup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pin: newPINString }),
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
			}

			if (data.success) {
				setHasPIN(true);
				setShowSetupPINModal(false);
				resetPINStates();
				showNotification('success', 'PIN setup successfully!');
			} else {
				showNotification('error', data.message || 'Failed to setup PIN');
			}
		} catch (error) {
			showNotification('error', 'Failed to setup PIN');
		} finally {
			setLoading(false);
		}
	};

	const handleRequestPINChange = async () => {
		setLoading(true);
		try {
			const response = await fetch('/api/v1/accounts/pin/request-change', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
				toast.error(data.message);
			}

			if (data.success) {
				setShowChangePINModal(false);
				setShowVerifyTokenModal(true);
				showNotification('success', 'Verification token sent to your email!');
			} else {
				showNotification(
					'error',
					data.message || 'Failed to send verification token',
				);
			}
		} catch (error) {
			showNotification('error', 'Failed to request PIN change');
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyTokenAndChangePIN = async () => {
		const tokenString = token.join('');
		const newPINString = newPIN.join('');

		if (tokenString.length !== 6) {
			showNotification('error', 'Please enter a valid 6-digit token');
			toast.error('Please enter a valid 6-digit token');
			return;
		}

		if (newPINString.length !== 4) {
			showNotification('error', 'Please enter a valid 4-digit PIN');
			toast.error('Please enter a valid 4-digit PIN');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/v1/accounts/pin/change', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					otp: tokenString,
					pin: newPINString,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
			}

			if (data.success) {
				setShowVerifyTokenModal(false);
				resetPINStates();
				showNotification('success', 'PIN changed successfully!');
			} else {
				showNotification('error', data.message || 'Failed to change PIN');
			}
		} catch (error) {
			showNotification('error', 'Failed to change PIN');
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		try {
			const response = await fetch('/api/v1/accounts/pin/resend-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();

			if (!response.ok) {
				showNotification('error', data.message);
				toast.error(data.message);
			}

			if (data.success) {
				showNotification(
					'success',
					'New verification code sent to your email!',
				);
			} else {
				showNotification('error', data.message || 'Failed to resend OTP');
				throw new Error(data.message);
			}
		} catch (error) {
			showNotification('error', 'Failed to resend verification code');
			throw error;
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<NotificationToast notification={notification} />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<AccountsHeader
					accountsCount={accounts.length}
					maxAccounts={3}
					hasPIN={hasPIN}
					onOpenChangePIN={() => setShowChangePINModal(true)}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Accounts List Section */}
					<div>
						<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
							Your Linked Accounts
						</h2>
						<AccountsList
							accounts={accounts}
							onDeleteAccount={(account) => {
								setSelectedAccount(account);
								setShowDeleteModal(true);
							}}
						/>
					</div>

					{/* Add Account Form Section */}
					<AddAccountForm
						banks={banks}
						accountsCount={accounts.length}
						maxAccounts={3}
						loading={loading}
						verifyingAccount={verifyingAccount}
						formData={formData}
						onFormChange={(data) => setFormData({ ...formData, ...data })}
						onVerifyAccount={verifyAccount}
						onSubmit={handleAddAccount}
					/>
				</div>
			</div>

			{/* Modals */}
			{showDeleteModal && (
				<DeleteAccountModal
					account={selectedAccount}
					pin={pin}
					loading={loading}
					onPinChange={(index, val) => {
						const newPin = [...pin];
						newPin[index] = val;
						setPin(newPin);
					}}
					onConfirm={handleDeleteAccount}
					onCancel={() => {
						setShowDeleteModal(false);
						resetPINStates();
						setSelectedAccount(null);
					}}
				/>
			)}

			{showSetupPINModal && (
				<SetupPINModal
					newPIN={newPIN}
					confirmPIN={confirmPIN}
					loading={loading}
					onNewPINChange={(index, val) => {
						const newPin = [...newPIN];
						newPin[index] = val;
						setNewPIN(newPin);
					}}
					onConfirmPINChange={(index, val) => {
						const newPin = [...confirmPIN];
						newPin[index] = val;
						setConfirmPIN(newPin);
					}}
					onConfirm={handleSetupPIN}
					onCancel={() => setShowSetupPINModal(false)}
				/>
			)}

			{showChangePINModal && (
				<ChangePINModal
					loading={loading}
					onConfirm={handleRequestPINChange}
					onCancel={() => setShowChangePINModal(false)}
				/>
			)}

			{showVerifyTokenModal && (
				<VerifyTokenModal
					token={token}
					newPIN={newPIN}
					loading={loading}
					onTokenChange={(index, val) => {
						const newToken = [...token];
						newToken[index] = val;
						setToken(newToken);
					}}
					onPINChange={(index, val) => {
						const newPin = [...newPIN];
						newPin[index] = val;
						setNewPIN(newPin);
					}}
					onConfirm={handleVerifyTokenAndChangePIN}
					onCancel={() => {
						setShowVerifyTokenModal(false);
						resetPINStates();
					}}
					onResendOTP={handleResendOTP}
				/>
			)}
		</div>
	);
}

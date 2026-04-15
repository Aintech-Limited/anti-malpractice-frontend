import { useEffect, useState } from 'react';
import { IPayment, IPaymentApiResponse } from '../interface';

export const usePayments = (initialData: IPaymentApiResponse) => {
	const [payments, setPayments] = useState<IPayment[]>(initialData.data);
	const [meta, setMeta] = useState(initialData.meta);
	const [loading, setLoading] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
	const [showCourseModal, setShowCourseModal] = useState(false);

	useEffect(() => {
		setPayments(initialData.data);
		setMeta(initialData.meta);
	}, [initialData]);

	const updatePayments = (
		newPayments: IPayment[],
		newMeta: IPaymentApiResponse['meta'],
	) => {
		setPayments(newPayments);
		setMeta(newMeta);
	};

	return {
		payments,
		meta,
		loading,
		selectedPayment,
		showCourseModal,
		updatePayments,
		setLoadingState: setLoading,
		openCourseModal: (payment: IPayment) => {
			setSelectedPayment(payment);
			setShowCourseModal(true);
		},
		closeCourseModal: () => {
			setShowCourseModal(false);
			setSelectedPayment(null);
		},
	};
};

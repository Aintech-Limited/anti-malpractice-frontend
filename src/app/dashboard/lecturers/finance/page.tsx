import { ProtectedRouteEnum } from '@/src/lib/enums';
import { redirect } from 'next/navigation';

export default async function PaymentsPage() {
	redirect(ProtectedRouteEnum.LECTURERS + '/finance/history');
}

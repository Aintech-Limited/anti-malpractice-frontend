import { initialStudents } from '@/src/components/Dashboard/Admin/Students/data';
import Students from '@/src/components/Dashboard/Admin/Students/Students';

export default function StudentsPage() {
	return <Students initialStudents={initialStudents} />;
}

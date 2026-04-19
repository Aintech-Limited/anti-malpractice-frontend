import { TCourseStatus } from '../components/Dashboard/Student/CoursesCatalog/interface';

export const compressImage = async (
	dataUrl: string,
	maxWidth = 1280,
	quality = 0.75,
): Promise<string> => {
	const img = new Image();
	img.src = dataUrl;

	await new Promise((resolve) => (img.onload = resolve));

	const scale = Math.min(1, maxWidth / img.width);

	const canvas = document.createElement('canvas');
	canvas.width = img.width * scale;
	canvas.height = img.height * scale;

	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	return canvas.toDataURL('image/jpeg', quality);
};

/**
 * Formats a given time(in seconds) into mins. e.g 60:20
 *
 * @param {number} seconds The time in seconds to format.
 * @returns {string} The formatted time
 */
export const formatTimeSecToMin = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const dataURLtoFile = (dataUrl: string, filename: string) => {
	const arr = dataUrl.split(',');
	const mime = arr[0].match(/:(.*?);/)?.[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
};

export async function apiFetch(url: string, options: RequestInit = {}) {
	const res = await fetch(url, {
		...options,
		credentials: 'include',
	});

	if (res.status !== 401) return res;

	// try refresh
	const refresh = await fetch('/api/v1/auth/refresh', {
		method: 'POST',
		credentials: 'include',
	});

	if (!refresh.ok) throw new Error('Session expired');

	return fetch(url, {
		...options,
		credentials: 'include',
	});
}

export const detectBlur = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d');
	if (!ctx) return 0;

	const { width, height } = canvas;
	const imageData = ctx.getImageData(0, 0, width, height);
	const data = imageData.data;

	// Convert to grayscale
	const gray = new Float32Array(width * height);

	for (let i = 0, j = 0; i < data.length; i += 4, j++) {
		gray[j] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
	}

	let sum = 0;
	let sumSq = 0;
	let count = 0;

	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			const idx = y * width + x;

			const lap =
				-4 * gray[idx] +
				gray[idx - 1] +
				gray[idx + 1] +
				gray[idx - width] +
				gray[idx + width];

			sum += lap;
			sumSq += lap * lap;
			count++;
		}
	}

	const mean = sum / count;
	const variance = sumSq / count - mean * mean;

	return variance; // tune threshold < 100
};

export function generateAcademicSemesters(): {
	view: string;
	semester: '1' | '2';
}[] {
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - 2;
	const semesters: { view: string; semester: '1' | '2' }[] = [];

	for (let i = 0; i < 10; i++) {
		const year = startYear + i;
		semesters.push({
			view: `${year}/${year + 1} - 1st Semester`,
			semester: '1',
		});
		semesters.push({
			view: `${year}/${year + 1} - 2nd Semester`,
			semester: '2',
		});
	}

	return semesters;
}

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const getStatusColor = (status: TCourseStatus): string => {
	switch (status) {
		case 'registered':
			return 'bg-green-50 border-green-200 hover:border-green-300';
		case 'active':
			return 'bg-blue-50 border-blue-200 hover:border-blue-300';
		case 'available':
			return 'bg-white border-gray-200 hover:border-gray-300';
		case 'locked':
			return 'bg-gray-50 border-gray-200 opacity-75';
		default:
			return 'bg-white border-gray-200';
	}
};

export const getLevelLabel = (level: number): string => {
	return `Level ${level}`;
};

export const formatCredits = (credits: number): string => {
	return `${credits} Credit${credits !== 1 ? 's' : ''}`;
};

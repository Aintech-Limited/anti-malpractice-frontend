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

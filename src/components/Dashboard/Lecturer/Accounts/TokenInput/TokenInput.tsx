'use client';

import { ITokenInputProps } from './interface';

export default function TokenInput({ value, onChange }: ITokenInputProps) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				Enter 6-digit verification token
			</label>
			<div className="flex gap-2 justify-center">
				{value.map((digit, index) => (
					<input
						key={index}
						type="text"
						maxLength={1}
						value={digit}
						onChange={(e) => {
							const val = e.target.value.replace(/[^0-9]/g, '');
							if (val.length <= 1) {
								onChange(index, val);
								if (val && index < value.length - 1) {
									const nextInput = document.getElementById(
										`token-input-${index + 1}`,
									);
									nextInput?.focus();
								}
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Backspace' && !digit && index > 0) {
								const prevInput = document.getElementById(
									`token-input-${index - 1}`,
								);
								prevInput?.focus();
							}
						}}
						id={`token-input-${index}`}
						className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
					/>
				))}
			</div>
		</div>
	);
}

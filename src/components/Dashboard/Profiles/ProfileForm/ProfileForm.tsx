'use client';

import { ProfileField } from '../ProfileField/ProfileField';
import { GENDER_OPTIONS } from '../utils/profileConstants';
import {
	formatDateForInput,
	convertDateToDobFormat,
} from '../utils/profileHelpers';
import { IProfileFormProps } from './interface';

export const ProfileForm = ({
	formData,
	isEditing,
	onFormChange,
}: IProfileFormProps) => {
	const handleDateChange = (value: string) => {
		const formattedDob = convertDateToDobFormat(value);
		onFormChange({ dob: formattedDob });
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<ProfileField
				label="First Name"
				value={formData.firstName}
				isEditing={isEditing}
				onChange={(value) => onFormChange({ firstName: value })}
			/>

			<ProfileField
				label="Last Name"
				value={formData.lastName}
				isEditing={isEditing}
				onChange={(value) => onFormChange({ lastName: value })}
			/>

			<ProfileField
				label="Date of Birth"
				value={formatDateForInput(formData.dob)}
				isEditing={isEditing}
				type="date"
				onChange={handleDateChange}
			/>

			<ProfileField
				label="Sex"
				value={formData.sex}
				isEditing={isEditing}
				type="select"
				options={GENDER_OPTIONS}
				onChange={(value) => onFormChange({ sex: value })}
			/>

			<div className="md:col-span-2">
				<ProfileField
					label="Phone Contact"
					value={formData.phoneContact}
					isEditing={isEditing}
					type="tel"
					onChange={(value) => onFormChange({ phoneContact: value })}
				/>
			</div>
		</div>
	);
};

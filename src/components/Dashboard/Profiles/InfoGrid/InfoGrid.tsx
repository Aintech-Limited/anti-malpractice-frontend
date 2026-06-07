import { INFO_CARDS_CONFIG } from '../utils/profileConstants';
import { IInfoGridProps } from './interface';
import { InfoCard } from '../InfoCard/InfoCard';
import { IUserModel } from '@/src/types/user';

export const InfoGrid = ({ user }: IInfoGridProps) => {
	return (
		<div className="mt-8 pt-6 border-t border-gray-200">
			<h3 className="font-semibold text-gray-800 mb-4">Account Information</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{INFO_CARDS_CONFIG.map((config) => (
					<InfoCard
						key={config.key}
						icon={config.icon}
						label={config.label}
						value={user[config.key as keyof IUserModel] as string | boolean}
					/>
				))}
			</div>
		</div>
	);
};

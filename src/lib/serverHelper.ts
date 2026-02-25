'use server';

import { decodeJwt, JWTPayload } from 'jose';

/**
 * Get JWT header without verification
 * @param {string} token - The JWT token
 * @returns {Object} - The decoded header
 */
export async function decodeMyJwt(
	token: string,
): Promise<JWTPayload & { profileType: string }> {
	try {
		return decodeJwt(token) as JWTPayload & { profileType: string };
	} catch (error) {
		throw new Error(`Failed to decode header: ${(error as Error).message}`);
	}
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOTPExpiryInitialState } from './interface';

const initialState: IOTPExpiryInitialState = {
	otpExpiry: null,
	email: null,
};

const otpExpirySlice = createSlice({
	name: 'aotpExpiry',
	initialState,
	reducers: {
		setOTPState(state, action: PayloadAction<{ otpExpiry: number }>) {
			state.otpExpiry = action.payload.otpExpiry;
		},
		clearOTPState(state) {
			state.otpExpiry = null;
		},
		setOTPEmailState(state, action: PayloadAction<{ email: string }>) {
			state.email = action.payload.email;
		},
		clearOTPEmailState(state) {
			state.otpExpiry = null;
		},
	},
});

export const {
	setOTPState,
	clearOTPState,
	setOTPEmailState,
	clearOTPEmailState,
} = otpExpirySlice.actions;
export default otpExpirySlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IForgotPasswordInitialState } from './interface';

const initialState: IForgotPasswordInitialState = {
	passwordEmail: null,
	otpExpiry: null,
};

const forgotPasswordSlice = createSlice({
	name: 'aforgotPassword',
	initialState,
	reducers: {
		setPasswordEmailState(
			state,
			action: PayloadAction<{ passwordEmail: string }>,
		) {
			state.passwordEmail = action.payload.passwordEmail;
		},
		clearPasswordEmailState(state) {
			state.passwordEmail = null;
		},
		setPasswordOTPState(state, action: PayloadAction<{ otpExpiry: number }>) {
			state.otpExpiry = action.payload.otpExpiry;
		},
		clearPasswordOTPState(state) {
			state.otpExpiry = null;
		},
	},
});

export const {
	setPasswordEmailState,
	clearPasswordEmailState,
	setPasswordOTPState,
	clearPasswordOTPState,
} = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;

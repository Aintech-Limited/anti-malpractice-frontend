import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IFullSignupState,
	IFullSignupTokenState,
	ISignupInitialState,
} from './interface';

const initialState: ISignupInitialState = {
	signup: null,
	signupToken: null,
	signupType: null,
};

const signupSlice = createSlice({
	name: 'asignup',
	initialState,
	reducers: {
		setSignupState(state, action: PayloadAction<IFullSignupState>) {
			state.signup = action.payload;
		},
		clearSignupState(state) {
			state.signup = null;
		},
		setSignuptokenState(state, action: PayloadAction<IFullSignupTokenState>) {
			state.signupToken = action.payload;
		},
		clearSignupTokenState(state) {
			state.signupToken = null;
		},
		setSignupTypeState(
			state,
			action: PayloadAction<{ signupType: 'google' | 'email' }>,
		) {
			state.signupType = action.payload.signupType;
		},
		clearSignupTypeState(state) {
			state.signupType = null;
		},
	},
});

export const {
	setSignupState,
	clearSignupState,
	setSignuptokenState,
	clearSignupTokenState,
	setSignupTypeState,
	clearSignupTypeState,
} = signupSlice.actions;
export default signupSlice.reducer;

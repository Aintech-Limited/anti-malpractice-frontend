import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILecturerverifyInitState } from './interface';

const initialState: ILecturerverifyInitState = {
	photoIdType: null,
};

const lecturerVerifySliceSlice = createSlice({
	name: 'aphotoIdType',
	initialState,
	reducers: {
		setLecturerVerifyState(
			state,
			action: PayloadAction<ILecturerverifyInitState>,
		) {
			state.photoIdType = action.payload.photoIdType;
		},
		clearLecturerState(state) {
			state.photoIdType = null;
		},
	},
});

export const { setLecturerVerifyState, clearLecturerState } =
	lecturerVerifySliceSlice.actions;
export default lecturerVerifySliceSlice.reducer;

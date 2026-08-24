import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IVerificationState } from "./interface";

const initialState: IVerificationState = {
  frontId: null,
  backId: null,
  selfieId: null,
};

const lecturerVerificationImageSlice = createSlice({
  name: "alecturerVerificationImages",
  initialState,
  reducers: {
    setFrontImageId(state, action: PayloadAction<string>) {
      state.frontId = action.payload;
    },
    setBackImageId(state, action: PayloadAction<string>) {
      state.backId = action.payload;
    },
    setSelfieImageId(state, action: PayloadAction<string>) {
      state.selfieId = action.payload;
    },
    clearVerification(state) {
      state.frontId = null;
      state.backId = null;
    },
    clearSelfieImageId(state) {
      state.selfieId = null;
    },
  },
});

export const {
  setFrontImageId,
  setBackImageId,
  setSelfieImageId,
  clearVerification,
  clearSelfieImageId,
} = lecturerVerificationImageSlice.actions;

export default lecturerVerificationImageSlice.reducer;

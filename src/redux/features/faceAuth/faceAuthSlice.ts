import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFaceAuthInitialState } from "./interface";

const initialState: IFaceAuthInitialState = {
  SkipFaceAuth: null,
};

const faceAuthSliceSlice = createSlice({
  name: "afaceAuth",
  initialState,
  reducers: {
    setFaceAuthState(state, action: PayloadAction<IFaceAuthInitialState>) {
      state.SkipFaceAuth = action.payload.SkipFaceAuth;
    },
    clearFaceAuthState(state) {
      state.SkipFaceAuth = null;
    },
  },
});

export const { setFaceAuthState, clearFaceAuthState } =
  faceAuthSliceSlice.actions;
export default faceAuthSliceSlice.reducer;

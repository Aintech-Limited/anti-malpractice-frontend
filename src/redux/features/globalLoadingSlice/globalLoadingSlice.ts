import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGlobalLoadingState } from "./interface";

const initialState: IGlobalLoadingState = {
  visible: false,
  text: "Working...",
};

const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string | undefined>) => {
      state.visible = true;
      state.text = action.payload || "Loading...";
    },

    hideLoading: (state) => {
      state.visible = false;
    },

    setLoadingText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
  },
});

export const { showLoading, hideLoading, setLoadingText } =
  globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;

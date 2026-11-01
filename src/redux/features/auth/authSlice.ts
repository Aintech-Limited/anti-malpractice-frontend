import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAuthState,
  IFormattedPermissionsResponse,
  TAuthStatus,
} from "./interface";
import { IUserModel } from "@/src/types/user";

const initialState: IAuthState = {
  user: null,
  loading: false,
  status: "initializing",
  userRoles: null,
  userRolesLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserRolesLoading: (state, action: PayloadAction<boolean>) => {
      state.userRolesLoading = action.payload;
    },
    setUserRoles: (
      state,
      action: PayloadAction<IFormattedPermissionsResponse>,
    ) => {
      state.userRoles = action.payload;
      state.userRolesLoading = false;
      state.status = "authenticated";
    },

    setAuthStatus: (state, action: PayloadAction<TAuthStatus>) => {
      state.status = action.payload;
    },

    signIn: (state, action: PayloadAction<IUserModel>) => {
      state.user = action.payload;
      state.loading = false;
      state.status = "authenticated";
    },

    signOutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.status = "unauthenticated";
    },

    updateUser: (state, action: PayloadAction<Partial<IUserModel>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      } else {
        state.user = action.payload as IUserModel;
      }

      state.status = "authenticated";
    },

    resetAuth: () => initialState,
  },
});

export const {
  setLoading,
  signIn: signInAction,
  signOutUser,
  updateUser: updateUserAction,
  resetAuth,
  setAuthStatus: setAuthStatusAction,
  setUserRoles,
  setUserRolesLoading,
} = authSlice.actions;

export default authSlice.reducer;

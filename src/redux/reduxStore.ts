"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import LecturerVerifyReducer from "./features/lecturerVerify/lecturerVerifySlice";
import SignupRecucer from "./features/signup/signup";
import lecturerVerificationImageReducer from "./features/lecturerVerificationImages/lecturerVerificationImages";
import otpExpiryReducer from "./features/otpExpiry/otpExpirySlice";
import forgotPasswordReducer from "./features/forgotPassword/forgotPasswordSlice";
import faceAuthReducer from "./features/faceAuth/faceAuthSlice";
import globalLoadingReducer from "./features/globalLoadingSlice/globalLoadingSlice";

const themePersistConfig = { key: "asignup", storage };
const otpExpiryPersistConfig = { key: "aotpExpiry", storage };
const faceAuthPersistConfig = { key: "afaceAuth", storage };
const alecturerVerificationImagesPersistConfig = {
  key: "alecturerVerificationImages",
  storage,
};

const rootReducer = combineReducers({
  asignup: persistReducer(themePersistConfig, SignupRecucer),
  aphotoIdType: LecturerVerifyReducer,
  aforgotPassword: forgotPasswordReducer,
  aotpExpiry: persistReducer(otpExpiryPersistConfig, otpExpiryReducer),
  afaceAuth: persistReducer(faceAuthPersistConfig, faceAuthReducer),
  alecturerVerificationImages: persistReducer(
    alecturerVerificationImagesPersistConfig,
    lecturerVerificationImageReducer,
  ),
  globalLoading: globalLoadingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const purgeByKey = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`persist:${key}`);

    store.dispatch({ type: `${key}/reset` });
  }
};

export const purgeAllPersist = async () => {
  try {
    persistor.pause();

    await persistor.purge();

    await persistor.flush();

    store.dispatch({ type: `asignup/reset` });
    store.dispatch({ type: `aphotoIdType/reset` });
    store.dispatch({ type: `aforgotPassword/reset` });
    store.dispatch({ type: `aotpExpiry/reset` });
    store.dispatch({ type: `afaceAuth/reset` });
    store.dispatch({ type: `alecturerVerificationImages/reset` });
  } catch {
    console.error("Purge failed. Using Fallback Purge");
    // fallback if purge fails
    if (typeof window !== "undefined") {
      localStorage.removeItem(`persist:asignup`);
      localStorage.removeItem(`persist:aphotoIdType`);
      localStorage.removeItem(`persist:aforgotPassword`);
      localStorage.removeItem(`persist:aotpExpiry`);
      localStorage.removeItem(`persist:afaceAuth`);
      localStorage.removeItem(`persist:alecturerVerificationImages`);

      store.dispatch({ type: `asignup/reset` });
      store.dispatch({ type: `aphotoIdType/reset` });
      store.dispatch({ type: `aforgotPassword/reset` });
      store.dispatch({ type: `aotpExpiry/reset` });
      store.dispatch({ type: `afaceAuth/reset` });
      store.dispatch({ type: `alecturerVerificationImages/reset` });
    }
  }
};

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

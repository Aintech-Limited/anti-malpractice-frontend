"use client";
import { useEffect } from "react";
import {
  purgeAllPersist,
  useAppDispatch,
  useAppSelector,
} from "@/src/redux/reduxStore";
import {
  signInAction,
  signOutUser,
  updateUserAction,
  setLoading,
  setUserRoles,
} from "@/src/redux/features/auth/authSlice";
import { IAuthProviderProps } from "./interface";
import { IUserModel } from "@/src/types/user";

export function AuthProvider({
  children,
  userData,
}: Readonly<IAuthProviderProps>) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const { userRoles, ...restOfData } = (userData ?? {}) as any;
    // console.log("userRoles: ", userRoles, ", restOfData: ", restOfData);
    if (userData && !user) {
      dispatch(signInAction(restOfData));
      dispatch(setUserRoles(userRoles));
    } else if (!user) {
      dispatch(setLoading(false));
    }
  }, [userData, user, dispatch]);

  return <>{children}</>;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const signIn = (userData: IUserModel) => {
    if (!userData || typeof userData !== "object") {
      console.error("Invalid user data provided to signIn");
      return;
    }
    dispatch(setLoading(true));
    dispatch(signInAction(userData));
    dispatch(setLoading(false));
  };

  const signOut = () => {
    dispatch(signOutUser());
    purgeAllPersist();
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  };

  const updateUser = (userData: Partial<IUserModel>) => {
    if (!user) {
      console.warn("Cannot update user when no user is logged in");
      return;
    }

    if (!userData || typeof userData !== "object") {
      console.error("Invalid user data provided to updateUser");
      return;
    }

    dispatch(updateUserAction(userData));
  };

  const isAuthenticated = !!user;

  const getUserRole = () => {
    return user?.role || null;
  };

  return {
    user,
    signIn,
    loading,
    signOut,
    updateUser,
    isAuthenticated,
    getUserRole,
  };
};

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { IAuthContextType, IAuthProviderProps } from "./interface";
import { IUserModel } from "@/src/types/user";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  userData,
}: Readonly<IAuthProviderProps>) {
  const [user, setUser] = useState<IUserModel | null>(() => {
    if (userData) return userData;

    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("finduUser");
        if (storedUser && storedUser !== "undefined") {
          return JSON.parse(storedUser);
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("finduUser");
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(!userData && !user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("finduUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("finduUser");
      }
    }

    if (loading) {
      (() => setLoading(false))();
    }
  }, [user, loading]);

  useEffect(() => {
    if (userData && JSON.stringify(userData) !== JSON.stringify(user)) {
      (() => setUser(userData))();
    }
  }, [userData, user]);

  const signIn = (userData: IUserModel) => {
    if (!userData || typeof userData !== "object") {
      console.error("Invalid user data provided to signIn");
      return;
    }
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("finduUser");
    sessionStorage.clear();
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

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;

  const getUserRole = () => {
    return user?.role || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        loading,
        signOut,
        updateUser,
        isAuthenticated,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

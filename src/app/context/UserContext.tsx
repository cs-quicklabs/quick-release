"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getLoggedInUserDetailsRequest } from "@/fetchHandlers/authentication";
import { requestHandler, showNotification } from "@/Utils";
import { User } from "@/interfaces";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/atoms/Loading";

type UserContextType = {
  isLoading: boolean;
  loggedInUser: User | null;
  logout: (setIsLoading: ((loading: boolean) => void) | null) => Promise<void>;
  getLoggedInUserDetails: () => Promise<void>;
};

// Create a context to manage user related data and functions
const UserContext = createContext<UserContextType>({
  isLoading: false,
  loggedInUser: null,
  logout: async (setIsLoading: ((loading: boolean) => void) | null) => { },
  getLoggedInUserDetails: async () => { },
});

// Create a hook to access the UserContext
const useUserContext = () => useContext(UserContext);

// Create a component that provides user related data and functions
const UserProvider: React.FC<{ children: React.ReactNode; }> = ({
  children,
}) => {
  const router = useRouter();
  const { status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // Function to fetch the logged in user details
  const getLoggedInUserDetails = async () => {
    await requestHandler(
      async () => await getLoggedInUserDetailsRequest(),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        setLoggedInUser(data);
      },
      (errorMsg) => {
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle user logout
  const logout = async (setIsLoading: ((loading: boolean) => void) | null) => {
    setIsLoading?.(true);
    await signOut({ redirect: false });
    setIsLoading?.(false);
    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    if (status === "authenticated") {
      getLoggedInUserDetails();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setLoggedInUser(null);
    }
  }, [status]);

  // Provide logged in user-related data and functions through the context
  return (
    <UserContext.Provider value={{ isLoading, loggedInUser, logout, getLoggedInUserDetails }}>
      {
        (isLoading && !loggedInUser) || status === "loading" ? (
          <div className="h-screen">
            <Loading />
          </div>
        ) : children
      }
    </UserContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { UserContext, UserProvider, useUserContext };

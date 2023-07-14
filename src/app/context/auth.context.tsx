'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/models';
import { verify } from '@/services/auth';
import { APP } from '@/utils/app.constants';

export interface IAppContext {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoadingContext: boolean;
  storeToken(token: string): void;
  authenticateUser(): void;
  logOutUser(): void;
}

const AuthContext = createContext<IAppContext | null>(null);

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingContext, setIsLoadingContext] = useState<boolean>(true);
  const [user, setUser] = useState<IAppContext['user'] | null>(null);
  const router = useRouter();
  const storeToken = (token: string) => {
    localStorage.setItem(APP.localStorage.authToken, token);
  };

  const authenticateUser = async () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem(APP.localStorage.authToken);
    if (storedToken) {
      try {
        setIsLoadingContext(true);
        // We must send the JWT token in the request's "Authorization" Headers
        let user = await verify(storedToken);

        setIsLoggedIn(true);
        setIsLoadingContext(false);
        setUser(user);
      } catch (error) {
        // If the server sends an error response (invalid token)
        // Update state variables
        setIsLoggedIn(false);
        setIsLoadingContext(false);
        setUser(null);
      }
    } else {
      // If the token is not available (or is removed)
      setIsLoggedIn(false);
      setIsLoadingContext(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem(APP.localStorage.authToken);
  };

  const logOutUser = async () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    await authenticateUser();
    router.push(APP.pageRoutes.home);
  };

  //checks if theres any valid token in localStore in case user is returning after having closed the page
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoadingContext,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

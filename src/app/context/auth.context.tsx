/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */

'use client';

import React, { createContext, useEffect, useState } from 'react';
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
  const storeToken = (token: string) => {
    localStorage.setItem(APP.localStorage.authToken, token);
  };

  const resetAppStates = () => {
    setIsLoggedIn(false);
    setIsLoadingContext(false);
    setUser(null);
  };

  const authenticateUser = async () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem(APP.localStorage.authToken);
    if (storedToken) {
      try {
        setIsLoadingContext(true);
        // We must send the JWT token in the request's "Authorization" Headers
        const userInfo = await verify(storedToken);

        setIsLoggedIn(true);
        setIsLoadingContext(false);
        setUser(userInfo);
      } catch (error) {
        // If the server sends an error response (invalid token)
        // Update state variables
        resetAppStates();
      }
    } else {
      // If the token is not available (or is removed)
      resetAppStates();
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
    resetAppStates();
    window.location.href = APP.pageRoutes.home;
  };

  // checks if theres any valid token in localStore
  // in case user is returning after having closed the page
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

'use client';

import React, { createContext, useEffect, useState } from 'react';
import { IMonth, IUser } from '@/src/types';
import { getUserMonths, verify } from '@/src/app/api';
import { useRouter } from 'next/navigation';

export interface IAppContext {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoadingContext: boolean;
  months: IMonth[];
  storeToken(token: string): void;
  authenticateUser(): void;
  logOutUser(): void;
}

const AuthContext = createContext<IAppContext | null>(null);

function AuthProviderWrapper({ children }: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingContext, setIsLoadingContext] = useState<boolean>(true);
  const [months, setMonths] = useState<IMonth[]>([]);
  const [user, setUser] = useState<IAppContext['user'] | null>(null);
  const router = useRouter();
  const storeToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const authenticateUser = async () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        setIsLoadingContext(true);
        // We must send the JWT token in the request's "Authorization" Headers
        let user = await verify(storedToken);
        const data = await getUserMonths(user._id);
        setIsLoggedIn(true);
        setIsLoadingContext(false);
        setUser(user);
        setMonths(data);
      } catch (error) {
        // If the server sends an error response (invalid token)
        // Update state variables
        setIsLoggedIn(false);
        setIsLoadingContext(false);
        setUser(null);
        setMonths([]);
      }
    } else {
      // If the token is not available (or is removed)
      setIsLoggedIn(false);
      setIsLoadingContext(false);
      setUser(null);
      setMonths([]);
    }
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem('authToken');
  };

  const logOutUser = () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    authenticateUser();
    router.push('/');
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
        months,
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

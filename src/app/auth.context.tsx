'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMonth, IUser, IYear } from '@/types/models';
import { verify } from '@/services/auth';
import { APP } from '@/utils/app.constants';

export interface IAppContext {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoadingContext: boolean;
  userMonths: IMonth[];
  userYears: IYear[] | undefined;
  storeToken(token: string): void;
  authenticateUser(): void;
  logOutUser(): void;
}

const AuthContext = createContext<IAppContext | null>(null);

function AuthProviderWrapper({ children, allMonths }: { children: React.ReactNode; allMonths: IMonth[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingContext, setIsLoadingContext] = useState<boolean>(true);
  const [userMonths, setUserMonths] = useState<IMonth[]>([]);
  const [userYears, setUserYears] = useState<IYear[] | undefined>([]);
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
        // After user is authenticated we filter the user months
        // and setup all the context data
        const filteredMonths = allMonths.filter((month) => month.userId === user._id);
        filteredMonths.sort(function (a: any, b: any) {
          return a.createdAt - b.createdAt;
        });

        // create and get years data
        const yearsData = await getYearsData(filteredMonths);

        setIsLoggedIn(true);
        setIsLoadingContext(false);
        setUser(user);
        setUserMonths(filteredMonths);
        setUserYears(yearsData);
      } catch (error) {
        // If the server sends an error response (invalid token)
        // Update state variables
        setIsLoggedIn(false);
        setIsLoadingContext(false);
        setUser(null);
        setUserMonths([]);
        setUserYears([]);
      }
    } else {
      // If the token is not available (or is removed)
      setIsLoggedIn(false);
      setIsLoadingContext(false);
      setUser(null);
      setUserMonths([]);
      setUserYears([]);
    }
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem(APP.localStorage.authToken);
  };

  const logOutUser = () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    authenticateUser();
    router.push(APP.pageRoutes.home);
  };

  const getYearsData = async (filteredMonths: IMonth[]) => {
    // filter months by year
    const monthsByYear: { [year: number]: IMonth[] } = {};
    for (const month of filteredMonths) {
      const { createdAt } = month;
      if (createdAt.getFullYear() in monthsByYear) {
        monthsByYear[createdAt.getFullYear()].push(month);
      } else {
        monthsByYear[createdAt.getFullYear()] = [month];
      }
    }
    // create array of year objects
    const yearsData = Object.keys(monthsByYear).map((oneYear) => {
      const customYear: IYear = { incomes: [], expenses: [] };
      filteredMonths.forEach((month: IMonth) => {
        if (month.createdAt.getFullYear() === Number(oneYear)) {
          customYear.incomes = [...customYear.incomes, ...month.incomes];
          customYear.expenses = [...customYear.expenses, ...month.expenses];
          customYear.createdAt = new Date(Number(oneYear), 0, 1);
        }
      });
      return customYear;
    });

    return yearsData;
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
        userMonths,
        userYears,
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

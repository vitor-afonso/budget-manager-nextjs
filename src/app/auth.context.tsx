'use client';

import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IExpense, IIncome, IMonth, IUser, IYear } from '@/types/models';
import { verify } from '@/services/auth';
import { APP } from '@/utils/app.constants';
import { getUserMonths } from '@/services/months';

export interface IAppContext {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoadingContext: boolean;
  userMonths: IMonth[];
  userYears: IYear[];
  updateUserMonthsOnMonthCreation(createdMOnth: IMonth): void;
  updateMonthIncomeExpenseCreation(createdIncomeExpense: IIncome | IExpense, monthId: string): void;
  updateMonthIncomeExpenseDeletion(incomeExpenseId: string, monthId: string, isExpense: boolean): void;
  storeToken(token: string): void;
  authenticateUser(): void;
  logOutUser(): void;
}

const AuthContext = createContext<IAppContext | null>(null);

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingContext, setIsLoadingContext] = useState<boolean>(true);
  const [userMonths, setUserMonths] = useState<IMonth[]>([]);
  const [userYears, setUserYears] = useState<IYear[]>([]);
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

        // After user is authenticated we get all user months
        let months = await getUserMonths(user._id);
        months.sort((a: any, b: any) => a.createdAt - b.createdAt);

        // create and get years data
        const yearsData = await getYearsData(months);

        setIsLoggedIn(true);
        setIsLoadingContext(false);
        setUser(user);
        setUserMonths(months);
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

  const logOutUser = async () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    await authenticateUser();
    router.push(APP.pageRoutes.home);
  };

  // formats years data
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

  const updateUserMonthsOnMonthCreation = async (createdMonth: IMonth) => {
    const updatedUserMonths = [...userMonths, createdMonth];
    updatedUserMonths.sort((a: any, b: any) => a.createdAt - b.createdAt);
    setUserMonths(updatedUserMonths);
    const yearsData = await getYearsData(updatedUserMonths);
    setUserYears(yearsData);
  };

  const updateMonthIncomeExpenseCreation = async (createdIncomeExpense: IIncome | IExpense, monthId: string) => {
    const monthToUpdate = userMonths.find((oneMonth) => oneMonth._id === monthId);
    const filteredMonths = userMonths.filter((oneMonth) => oneMonth._id !== monthId);
    if (monthToUpdate) {
      if ('title' in createdIncomeExpense) {
        monthToUpdate!.expenses.push(createdIncomeExpense);
      } else {
        monthToUpdate!.incomes.push(createdIncomeExpense);
      }
      // updates userMonths and UserYears
      const updatedUserMonths = [...filteredMonths, monthToUpdate];
      updatedUserMonths.sort((a: any, b: any) => a.createdAt - b.createdAt);
      setUserMonths(updatedUserMonths);
      const yearsData = await getYearsData(updatedUserMonths);
      setUserYears(yearsData);
    }
  };

  const updateMonthIncomeExpenseDeletion = async (incomeExpenseId: string, monthId: string, isExpense: boolean) => {
    const monthToUpdate = userMonths.find((oneMonth) => oneMonth._id === monthId);
    const filteredMonths = userMonths.filter((oneMonth) => oneMonth._id !== monthId);
    if (monthToUpdate) {
      if (isExpense) {
        const filteredMonthExpenses = monthToUpdate.expenses.filter((oneExpense) => oneExpense._id !== incomeExpenseId);
        monthToUpdate.expenses = filteredMonthExpenses;
      } else {
        const filteredMonthIncomes = monthToUpdate.incomes.filter((oneIncome) => oneIncome._id !== incomeExpenseId);
        monthToUpdate.incomes = filteredMonthIncomes;
      }
      // updates userMonths and UserYears
      const updatedUserMonths = [...filteredMonths, monthToUpdate];
      updatedUserMonths.sort((a: any, b: any) => a.createdAt - b.createdAt);
      setUserMonths(updatedUserMonths);
      const yearsData = await getYearsData(updatedUserMonths);
      setUserYears(yearsData);
    }
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
        updateUserMonthsOnMonthCreation,
        updateMonthIncomeExpenseCreation,
        updateMonthIncomeExpenseDeletion,
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

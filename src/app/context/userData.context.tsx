/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */

'use client';

import React, { createContext, useContext, useState } from 'react';
import { IExpense, IIncome, IMonth, IYear } from '@/types/models';
import { getUserMonths } from '@/services/months';
import { AuthContext, IAppContext } from '@/app/context/auth.context';

export interface IUserDataContext {
  isLoadingUserDataContext: boolean;
  userMonths: IMonth[];
  userYears: IYear[];
  resetAppStates(): void;
  updateUserMonthsOnMonthCreation(createdMOnth: IMonth): void;
  updateMonthIncomeExpenseCreation(
    createdIncomeExpense: IIncome | IExpense,
    monthId: string,
  ): void;
  updateMonthIncomeExpenseDeletion(
    incomeExpenseId: string,
    monthId: string,
    isExpense: boolean,
  ): void;
  handleUserData(): void;
}

const UserDataContext = createContext<IUserDataContext | null>(null);

function UserDataProviderWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext) as IAppContext;
  const [isLoadingUserDataContext, setIsLoadingUserDataContext] =
    useState<boolean>(false);
  const [userMonths, setUserMonths] = useState<IMonth[]>([]);
  const [userYears, setUserYears] = useState<IYear[]>([]);

  const resetAppStates = () => {
    setIsLoadingUserDataContext(false);
    setUserMonths([]);
    setUserYears([]);
  };

  // formats years data
  const getYearsData = async (filteredMonths: IMonth[]) => {
    // filter months by year
    const monthsByYear: { [year: number]: IMonth[] } = {};

    filteredMonths.forEach((month) => {
      const { createdAt } = month;
      if (createdAt.getFullYear() in monthsByYear) {
        monthsByYear[createdAt.getFullYear()].push(month);
      } else {
        monthsByYear[createdAt.getFullYear()] = [month];
      }
    });

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

  const handleUserData = async () => {
    if (user) {
      setIsLoadingUserDataContext(true);
      try {
        // After user is authenticated we get all user months
        const months = await getUserMonths(user._id);
        months.sort((a: any, b: any) => a.createdAt - b.createdAt);

        // create and get years data
        const yearsData = await getYearsData(months);

        setUserMonths(months);
        setUserYears(yearsData);
      } catch (error) {
        // If the server sends an error response
        // Update state variables
        resetAppStates();
      } finally {
        setIsLoadingUserDataContext(false);
      }
    } else {
      // If the user is not available
      resetAppStates();
    }
  };

  const updateUserMonthsOnMonthCreation = async (createdMonth: IMonth) => {
    const updatedUserMonths = [...userMonths, createdMonth];
    updatedUserMonths.sort((a: any, b: any) => a.createdAt - b.createdAt);
    setUserMonths(updatedUserMonths);
    const yearsData = await getYearsData(updatedUserMonths);
    setUserYears(yearsData);
  };

  const updateMonthIncomeExpenseCreation = async (
    createdIncomeExpense: IIncome | IExpense,
    monthId: string,
  ) => {
    const monthToUpdate = userMonths.find(
      (oneMonth) => oneMonth._id === monthId,
    );
    const filteredMonths = userMonths.filter(
      (oneMonth) => oneMonth._id !== monthId,
    );
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

  const updateMonthIncomeExpenseDeletion = async (
    incomeExpenseId: string,
    monthId: string,
    isExpense: boolean,
  ) => {
    const monthToUpdate = userMonths.find(
      (oneMonth) => oneMonth._id === monthId,
    );
    const filteredMonths = userMonths.filter(
      (oneMonth) => oneMonth._id !== monthId,
    );
    if (monthToUpdate) {
      if (isExpense) {
        const filteredMonthExpenses = monthToUpdate.expenses.filter(
          (oneExpense) => oneExpense._id !== incomeExpenseId,
        );
        monthToUpdate.expenses = filteredMonthExpenses;
      } else {
        const filteredMonthIncomes = monthToUpdate.incomes.filter(
          (oneIncome) => oneIncome._id !== incomeExpenseId,
        );
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

  return (
    <UserDataContext.Provider
      value={{
        isLoadingUserDataContext,
        userMonths,
        userYears,
        resetAppStates,
        updateUserMonthsOnMonthCreation,
        updateMonthIncomeExpenseCreation,
        updateMonthIncomeExpenseDeletion,
        handleUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export { UserDataProviderWrapper, UserDataContext };

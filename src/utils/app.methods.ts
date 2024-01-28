/* eslint-disable no-plusplus */

import { IExpense, IIncome, IMonth, IYear } from '@/types/models';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { APP } from '@/utils/app.constants';
import React from 'react';

export const calculateTotal = (
  incomeExpenseList: IExpense[] | IIncome[],
): number => {
  let total = 0;
  incomeExpenseList.forEach((element) => {
    total += element.amount;
  });
  return total;
};

export const getMonthBalance = (month: IMonth | IYear): number => {
  const totalIncome = calculateTotal(month.incomes);
  const totalExpenses = calculateTotal(month.expenses);
  return totalIncome - totalExpenses;
};

export const getEventCreationDate = (
  creationDate: Date,
  eventType: string,
): string => {
  const monthYearDate = new Date(creationDate);
  const year = monthYearDate.getFullYear();
  const day = monthYearDate.getUTCDate();
  const month = monthYearDate.getUTCMonth();
  if (eventType === APP.eventType.month) {
    return format(new Date(year, month, day), 'MMM-yyyy');
  }
  if (
    eventType === APP.eventType.income ||
    eventType === APP.eventType.expense
  ) {
    return format(new Date(year, month, day), 'dd-MMM-yyyy');
  }

  return format(new Date(year, 1, 1), 'yyyy');
};

export const getCategoryTotals = (
  incomeExpenseList: (IIncome | IExpense)[],
): { categoryTotals: Map<string, number> } => {
  const categoryTotalsObject = new Map<string, number>();
  incomeExpenseList.forEach((item) => {
    const { category, amount } = item;
    const categoryName = capitalize(category).trim();
    const currentTotal = categoryTotalsObject.get(categoryName) || 0;
    categoryTotalsObject.set(categoryName, currentTotal + amount);
  });

  // convert Map to array
  const keyValuePairs = Array.from(categoryTotalsObject.entries());

  keyValuePairs.sort((a: any, b: any) => b[1] - a[1]);

  // convert array to Map instead of to object
  // so that we can keep the order of the properties
  const categoryTotals = new Map(keyValuePairs);

  return { categoryTotals };
};

export const getCategoryPercentage = (total: number, amount: number) => {
  if (total < 0) {
    throw new Error('Total must be a positive number.');
  }
  const percentage = (amount / total) * 100;
  return `${percentage.toFixed(2)}%`;
};

export const getCategoryNamestoShow = (
  incomeExpenseList: IIncome[] | IExpense[],
  categoryTotals: { [category: string]: number },
) => {
  const total = calculateTotal(incomeExpenseList);
  const categoryNames = Object.keys(categoryTotals).map((name) =>
    capitalize(name),
  );
  const categoryAmounts = Object.values(categoryTotals);

  const formattedNames = categoryAmounts.map(
    (item: number, i) =>
      `${categoryNames[i]} ${getCategoryPercentage(total, item)}`,
  );
  return formattedNames;
};

export const getGraphColors = (categoryType: string): string[] => {
  if (categoryType === APP.eventType.income) return APP.graphColdColors;
  return APP.graphWarmColors;
};

export const changeMonthYear = (
  userMonthsYears: IMonth[] | IYear[],
  buttonAction: string,
  index: number | null,
  setIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentMonthYear: React.Dispatch<
    React.SetStateAction<IMonth | IYear | null>
  >,
) => {
  if (index !== null) {
    const isPreviousButton = buttonAction === APP.buttonAction.prev;
    const isNextButton = buttonAction === APP.buttonAction.next;

    if (isPreviousButton && index > 0) {
      setIndex(index - 1);
      setCurrentMonthYear(userMonthsYears[index - 1]);
      return;
    }

    if (isNextButton && index < userMonthsYears.length - 1) {
      setIndex(index + 1);
      setCurrentMonthYear(userMonthsYears[index + 1]);
    }
  }
};

export const getYearIncomesExpensesBarData = (
  yearIncomeExpenses: IIncome[] | IExpense[],
  allOpenMonths: string[],
) => {
  const allMonthsTotals: { [month: string]: number } = {};

  yearIncomeExpenses.forEach((item) => {
    const { createdAt, amount } = item;
    const monthIndex = new Date(createdAt).getUTCMonth();
    const monthName = APP.monthsOfTheYear[monthIndex];
    allMonthsTotals[monthName] = (allMonthsTotals[monthName] || 0) + amount;
  });

  allOpenMonths.forEach((monthName) => {
    if (!(monthName in allMonthsTotals)) {
      allMonthsTotals[monthName] = 0;
    }
  });

  return allMonthsTotals;
};

export const getMinMaxDate = (date: Date, minMax: string): string => {
  const month =
    date.getMonth() < 9 ? 0 + String(date.getMonth() + 1) : date.getMonth() + 1;
  const year = date.getFullYear();
  const lastDayOfMonth = new Date(year, Number(month), 0).getDate();
  if (minMax === 'min') {
    return `${year}-${month}-01`;
  }
  return `${year}-${month}-${lastDayOfMonth}`;
};

export const getTotalExpensesOfLastMonthWeekDays = (
  numberOfDaysFromPreviousMonth: number,
  userMonths: IMonth[],
): number => {
  const LAST_DAY_OF_MONTH = 0;
  const DECEMBER = 11;
  const todaysDate = new Date();
  const previousYear = todaysDate.getFullYear() - 1;
  const isPrevMonthFromThisYear = todaysDate.getMonth() !== 0;
  const yearOfPrevMonth = isPrevMonthFromThisYear
    ? todaysDate.getFullYear()
    : previousYear;
  const previousMonthNumber = isPrevMonthFromThisYear
    ? todaysDate.getMonth() - 1
    : DECEMBER;
  const previousMonth = userMonths.find(
    (m) =>
      new Date(m.createdAt).getFullYear() === yearOfPrevMonth &&
      new Date(m.createdAt).getMonth() === previousMonthNumber,
  );
  // must have "previousMonthNumber + 1"
  // because LAST_DAY_OF_MONTH being 0 makes us get the month before the one we want
  const lastDayOfPreviousMonth = new Date(
    yearOfPrevMonth,
    previousMonthNumber + 1,
    LAST_DAY_OF_MONTH,
  ).getDate();
  let daysTotalExpenses = 0;

  for (let index = 0; index < numberOfDaysFromPreviousMonth; index++) {
    const dayExpenses = previousMonth?.expenses.filter(
      (e) =>
        new Date(e.createdAt).getUTCDate() === lastDayOfPreviousMonth - index,
    );
    const allExpensesAmount = dayExpenses?.map((e) => e.amount);
    const sum = allExpensesAmount?.reduce((total, num) => total + num, 0);
    daysTotalExpenses += sum!;
  }
  return daysTotalExpenses;
};

export const getTotalExpensesOfThisMonthWeekDays = (
  weekDaysFromThisMonth: number[],
  currentMonth: IMonth,
): number => {
  let totalWeekExpenses = 0;
  currentMonth?.expenses.forEach((e) => {
    const dayDate = new Date(e.createdAt).getUTCDate();

    if (
      weekDaysFromThisMonth.includes(dayDate) &&
      e.category.toLowerCase() !== 'bills'
    ) {
      totalWeekExpenses += e.amount;
    }
  });
  return totalWeekExpenses;
};

export const getWeekDaysOfCurrentMonth = (): number[] => {
  const todaysDate = new Date();
  const weekDayNumber = todaysDate.getUTCDay();
  const dayOfTheMonth = todaysDate.getUTCDate();
  const weekDaysFromThisMonth: number[] = [];

  for (let index = 0; index <= weekDayNumber; index++) {
    const day = dayOfTheMonth - index;
    if (day >= 0) {
      weekDaysFromThisMonth.push(day);
    }
  }
  return weekDaysFromThisMonth;
};

export const getNumberOfDaysFromPreviousMonth = (): number => {
  const todaysDate = new Date();
  const weekDayNumber = todaysDate.getUTCDay();
  const dayOfTheMonth = todaysDate.getUTCDate();
  let numberOfDaysFromPreviousMonth = 0;

  for (let index = 0; index <= weekDayNumber; index++) {
    const day = dayOfTheMonth - index;
    if (day <= 0) {
      numberOfDaysFromPreviousMonth += 1;
    }
  }
  return numberOfDaysFromPreviousMonth;
};

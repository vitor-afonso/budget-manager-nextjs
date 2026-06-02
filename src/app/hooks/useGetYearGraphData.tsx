'use client';

import { useTranslations } from 'next-intl';
import { getYearIncomesExpensesBarData } from '@/utils/app.methods';
import { IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';

const EN_MONTHS = APP.monthsOfTheYear;

const useGetYearGraphData = (yearData: IYear, allOpenMonths: Date[]) => {
  const tMonths = useTranslations('months');

  const translatedMonths = EN_MONTHS.map((_, i) => {
    const keys = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ] as const;
    return tMonths(keys[i]);
  });

  function getBarData(year: IYear, eventType: string) {
    const allMonthNamesEN = allOpenMonths.map(
      (date) => EN_MONTHS[new Date(date).getMonth()],
    );
    const incomesObj = getYearIncomesExpensesBarData(
      year.incomes,
      allMonthNamesEN,
    );
    const expensesObj = getYearIncomesExpensesBarData(
      year.expenses,
      allMonthNamesEN,
    );
    const isExpenses = eventType === APP.eventType.expense;
    const result: { [monthName: string]: number } = {};

    allMonthNamesEN.forEach((enName) => {
      const translatedName = translatedMonths[EN_MONTHS.indexOf(enName)];
      result[translatedName] = isExpenses
        ? expensesObj[enName]
        : incomesObj[enName];
    });

    return result;
  }

  const incomeBarData = Object.values(
    getBarData(yearData, APP.eventType.income),
  );
  const expenseBarData = Object.values(
    getBarData(yearData, APP.eventType.expense),
  );
  const monthNames = Object.keys(getBarData(yearData, APP.eventType.expense));

  return {
    incomeBarData,
    expenseBarData,
    monthNames,
  };
};

export default useGetYearGraphData;

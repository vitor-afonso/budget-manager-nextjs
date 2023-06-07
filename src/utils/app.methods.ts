import { IExpense, IIncome, IMonth, IYear } from '@/types/models';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { APP } from './app.constants';

export const calculateTotal = (incomeExpenseList: IExpense[] | IIncome[]): number => {
  let total = 0;
  incomeExpenseList.forEach((element) => {
    total += element.amount;
  });
  return Number(total.toFixed(2));
};
export const getMonthBalance = (month: IMonth | IYear): number => {
  let totalIncome = calculateTotal(month.incomes);
  let totalExpenses = calculateTotal(month.expenses);
  return totalIncome - totalExpenses;
};

export const getEventCreationDate = (monthYear: Date, eventType: string): string => {
  let year = monthYear.getFullYear();

  let day = monthYear.getUTCDate();
  let month = monthYear.getUTCMonth();
  if (eventType === APP.eventType.month) {
    return format(new Date(year, month, day), 'MMM-yyyy');
  }
  if (eventType === APP.eventType.income || eventType === APP.eventType.expense) {
    return format(new Date(year, month, day), 'dd-MMM-yyyy');
  }

  return format(new Date(year, 1, 1), 'yyyy');
};

export const getCategoryTotals = (incomeExpenseList: (IIncome | IExpense)[]): { categoryTotals: { [category: string]: number } } => {
  const categoryTotals: { [category: string]: number } = {};

  for (const item of incomeExpenseList) {
    const { category, amount } = item;
    if (category in categoryTotals) {
      categoryTotals[category] += amount;
    } else {
      categoryTotals[category] = amount;
    }
  }

  for (const category in categoryTotals) {
    categoryTotals[category] = Number(categoryTotals[category].toFixed(2));
  }

  return { categoryTotals };
};

export const getCategoryNamestoShow = (incomeExpenseList: IIncome[] | IExpense[], categoryTotals: { [category: string]: number }) => {
  try {
    let total = calculateTotal(incomeExpenseList);
    const categoryNames = Object.keys(categoryTotals).map((name) => capitalize(name));
    let categoryAmounts = Object.values(categoryTotals);

    let formattedNames = categoryAmounts.map((item: number, i) => `${categoryNames[i]} ${getCategoryPercentage(total, item)}`);
    return formattedNames;
  } catch (error) {
    console.error(error);
  }
};

export const getCategoryPercentage = (total: number, amount: number) => {
  if (total <= 0) {
    throw new Error('Total must be a positive number.');
  }
  const percentage = (amount / total) * 100;
  return percentage.toFixed(2) + '%';
};

export const getGraphColors = (categoryType: string): string[] => {
  return categoryType === APP.eventType.income ? APP.graphColdColors : APP.graphWarmColors;
};

export const changeMonthYear = (
  userMonthsYears: IMonth[] | IYear[],
  buttonAction: string,
  index: number | null,
  setIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentMonthYear: React.Dispatch<React.SetStateAction<IMonth | IYear | null>>
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
      return;
    }
  }
};

export const getYearIncomesExpensesBarData = (yearIncomeExpenses: IIncome[] | IExpense[]) => {
  const categoryTotals: { [category: string]: number } = {};

  for (const item of yearIncomeExpenses) {
    const { createdAt, amount } = item;
    const monthIndex = createdAt.getUTCMonth();
    if (APP.monthsOfTheYear[monthIndex] in categoryTotals) {
      categoryTotals[APP.monthsOfTheYear[monthIndex]] += amount;
    } else {
      categoryTotals[APP.monthsOfTheYear[monthIndex]] = amount;
    }
  }

  return categoryTotals;
};

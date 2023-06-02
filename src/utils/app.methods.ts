import { IExpense, IIncome, IMonth } from '@/types/models';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { APP } from './app.constants';

interface IChangeMontYearProps {
  buttonAction: string;
  userMonths: IMonth[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentMonthYear: React.Dispatch<React.SetStateAction<IMonth>>;
}

export const calculateTotal = (incomeExpenseList: IExpense[] | IIncome[]): number => {
  let total = 0;
  incomeExpenseList.forEach((element) => {
    total += element.amount;
  });
  return total;
};
export const getMonthBalance = (month: IMonth): number => {
  let totalIncome = calculateTotal(month.incomes);
  let totalExpenses = calculateTotal(month.expenses);
  return totalIncome - totalExpenses;
};

export const getEventCreationDate = (monthDate: Date, eventType: string): string => {
  let day = monthDate.getUTCDate();
  let month = monthDate.getUTCMonth();
  let year = monthDate.getFullYear();

  if (eventType === 'income' || eventType === 'expense') {
    return format(new Date(year, month, day), 'dd-MMM-yyyy');
  }

  return format(new Date(year, month, day), 'MMM-yyyy');
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
  let total = calculateTotal(incomeExpenseList);
  const categoryNames = Object.keys(categoryTotals).map((name) => capitalize(name));
  let categoryAmounts = Object.values(categoryTotals);

  let formatedNames = categoryAmounts.map((item: number, i) => `${categoryNames[i]} ${getCategoryPercentage(total, item)}`);
  return formatedNames;
};

export const getCategoryPercentage = (total: number, amount: number) => {
  if (total <= 0) {
    return 'Total must be a positive number.';
  }
  const percentage = (amount / total) * 100;
  return percentage.toFixed(2) + '%';
};

export const getGraphColors = (categoryType: string): string[] => {
  return categoryType === APP.eventType.income ? APP.graphColdColors : APP.graphWarmColors;
};

export const changeMonthYear = (
  buttonAction: string,
  userMonths: IMonth[],
  index: number | null,
  setIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentMonthYear: React.Dispatch<React.SetStateAction<IMonth | null>>
) => {
  if (index !== null && index > 0 && buttonAction === APP.buttonAction.prev) {
    setIndex(index - 1);
    setCurrentMonthYear(userMonths[index - 1]);
    return;
  }

  if (index !== null && index < userMonths.length - 1 && buttonAction === APP.buttonAction.next) {
    setIndex(index + 1);
    setCurrentMonthYear(userMonths[index + 1]);
    return;
  }
};

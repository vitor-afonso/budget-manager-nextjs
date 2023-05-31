import { IExpense, IIncome, IMonth } from '@/types/models';
import { format } from 'date-fns';

export const calculateTotal = (collection: IExpense[] | IIncome[]): number => {
  let total = 0;
  collection.forEach((element) => {
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

import { parseISO } from 'date-fns';
import { APP } from '@/utils/app.constants';
import axios from 'axios';

interface CreateIncomeExpense {
  title?: string;
  category: string;
  amount: number;
  monthId: string;
  creationDate: Date;
}

export const createIncomeExpense = async (
  reqBody: CreateIncomeExpense,
  isExpense: boolean,
) => {
  const routeName = isExpense ? '/expenses' : '/incomes';
  const apiUrl = `${APP.projectApi}${routeName}`;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(reqBody),
    });
    const incomeExpense = await res.json();

    // parse date before sending it to component
    return {
      ...incomeExpense,
      createdAt: parseISO(incomeExpense.createdAt),
      updatedAt: parseISO(incomeExpense.updatedAt),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteIncomeExpense = async (
  incomeExpenseId: string,
  isExpense: boolean,
) => {
  const expenseBody = isExpense && { expenseId: incomeExpenseId };
  const incomeBody = !isExpense && { incomeId: incomeExpenseId };
  const routeName = isExpense
    ? `/expenses/${incomeExpenseId}`
    : `/incomes/${incomeExpenseId}`;

  const apiUrl = `${APP.projectApi}${routeName}`;

  const options ={
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(isExpense ? expenseBody : incomeBody),
  }
  const {data} = await axios.delete(apiUrl,options)

  return data.message
};

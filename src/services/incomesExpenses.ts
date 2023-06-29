import { parseISO } from 'date-fns';
import { APP } from '@/utils/app.constants';

interface CreateIncomeExpense {
  title?: string;
  category: string;
  amount: number;
  monthId: string;
  creationDate: Date;
}

export const createIncomeExpense = async (reqBody: CreateIncomeExpense, isExpense: boolean) => {
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
    let incomeExpense = await res.json();
    // parse date before sending it to component
    return { ...incomeExpense, createdAt: parseISO(incomeExpense.createdAt), updatedAt: parseISO(incomeExpense.updatedAt) };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

'use client';
import { useContext } from 'react';
import { AuthContext, IAppContext } from '@/src/app/auth.context';
import Link from 'next/link';
import { IIncome, IMonth } from '@/src/types';

export default async function Home() {
  const { user, months, isLoadingContext } = useContext(AuthContext) as IAppContext;

  return (
    <main>
      <h1>Month Dashboard</h1>
      {months.length === 0 && !isLoadingContext && <p>No months to display</p>}
      {months.length > 0 &&
        !isLoadingContext &&
        months.map((month: IMonth) => {
          return (
            <div key={month._id}>
              {month.incomes.map((income: IIncome) => (
                <div key={income._id}>
                  <p>Category {income.category}</p>
                  <p>Amount: {income.amount}</p>
                </div>
              ))}
            </div>
          );
        })}
      <Link href={'/login'}>Login</Link>
    </main>
  );
}

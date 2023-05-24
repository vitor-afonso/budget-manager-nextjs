'use client';
import { useContext } from 'react';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { IIncome, IMonth } from '@/types/models';

export default function Month(): JSX.Element {
  const { user, userMonths, isLoadingContext } = useContext(AuthContext) as IAppContext;

  return (
    <section>
      <h1>Month Section</h1>
      {userMonths.length === 0 && !isLoadingContext && <p>No months to display</p>}
      {userMonths.length > 0 &&
        !isLoadingContext &&
        userMonths.map((month: IMonth) => {
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
    </section>
  );
}

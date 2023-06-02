'use client';
import { useContext, useEffect, useState } from 'react';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { IMonth } from '@/types/models';
import { APP } from '@/utils/app.constants';
import MonthEvents from '@/components/MonthEvents';
import MonthYearHeader from '@/components/MonthYearHeader';

export default function Month(): JSX.Element {
  const { userMonths } = useContext(AuthContext) as IAppContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);

  // to set the current month
  useEffect(() => {
    if (userMonths.length > 0) {
      let month = userMonths.find((oneMonth, i) => {
        if (isSameMonth(new Date(), oneMonth.createdAt)) {
          setMonthIndex(i);
          return oneMonth;
        }
      });
      if (month) {
        month && setCurrentMonth(month);
      }
    }
  }, [userMonths]);

  return (
    <section className='w-full sm:w-80'>
      {currentMonth && userMonths.length > 0 && (
        <div className='w-full'>
          <MonthYearHeader index={monthIndex} currentMonthYear={currentMonth} setCurrentMonthYear={setCurrentMonth} setIndex={setMonthIndex} />
          <MonthEvents events={currentMonth.incomes} eventType={APP.eventType.income} />
          <MonthEvents events={currentMonth.expenses} eventType={APP.eventType.expense} />
        </div>
      )}
    </section>
  );
}

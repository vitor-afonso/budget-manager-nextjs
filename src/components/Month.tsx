'use client';
import { useContext, useEffect, useState } from 'react';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { IMonth, IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';
import MonthEvents from '@/components/MonthEvents';
import MonthYearHeader from '@/components/MonthYearHeader';
import { IUserDataContext, UserDataContext } from '@/app/context/userData.context';

export default function Month(): JSX.Element {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, handleUserData } = useContext(UserDataContext) as IUserDataContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | IYear | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);
  const [monthId, setMonthId] = useState<string>('');

  useEffect(() => {
    if (user) {
      handleUserData();
    }
  }, [user]);

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
        setCurrentMonth(month);
        setMonthId(month._id);
      }
    }
  }, [userMonths]);

  useEffect(() => {
    if (currentMonth && '_id' in currentMonth) {
      setMonthId(currentMonth._id);
    }
  }, [currentMonth]);

  return (
    <section className='w-full sm:w-80'>
      {currentMonth && userMonths.length > 0 && (
        <div className='w-full'>
          <MonthYearHeader userMonthsYears={userMonths} index={monthIndex} currentMonthYear={currentMonth} setCurrentMonthYear={setCurrentMonth} setIndex={setMonthIndex} />
          <MonthEvents events={currentMonth.incomes} eventType={APP.eventType.income} monthId={monthId} />
          <MonthEvents events={currentMonth.expenses} eventType={APP.eventType.expense} monthId={monthId} />
        </div>
      )}
    </section>
  );
}

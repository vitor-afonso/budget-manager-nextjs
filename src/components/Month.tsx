'use client';

import { useContext, useEffect, useState } from 'react';
import { isSameMonth } from 'date-fns';
import { IMonth, IYear } from '@/types/models';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import { APP } from '@/utils/app.constants';
import {
  getNumberOfDaysFromPreviousMonth,
  getTotalExpensesOfLastMonthWeekDays,
  getTotalExpensesOfThisMonthWeekDays,
  getWeekDaysOfCurrentMonth,
} from '@/utils/app.methods';
import MonthEvents from '@/components/MonthEvents';
import MonthYearHeader from '@/components/MonthYearHeader';
import WeekBalanceSection from '@/components/WeekBalanceSection';

export default function Month(): JSX.Element {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, handleUserData } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | IYear | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);
  const [spentThisWeek, setSpentThisWeek] = useState<number | null>(null);
  const [monthId, setMonthId] = useState<string>('');
  const [weekBalance, setWeekBalance] = useState<number | null>(null);
  const [weekLimit, setWeekLimit] = useState<number | null>(null);
  const [showWeekBalance, setShowWeekBalance] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      handleUserData();
    }
  }, [user]);

  // to set the current month
  useEffect(() => {
    if (userMonths.length > 0) {
      const lastMonthIndex = userMonths.length - 1;
      const month = userMonths.find((oneMonth, i) => {
        if (isSameMonth(new Date(), oneMonth.createdAt)) {
          setMonthIndex(i);
          return oneMonth;
        }
        return null;
      });
      if (month) {
        setCurrentMonth(month);
        setMonthId(month._id);
        return;
      }
      // set currentMonth to the last month of the array when current month is not open
      setCurrentMonth(userMonths[lastMonthIndex]);
      setMonthId(userMonths[lastMonthIndex]._id);
      setMonthIndex(lastMonthIndex);
    }
  }, [userMonths]);

  useEffect(() => {
    if (currentMonth && '_id' in currentMonth) {
      setMonthId(currentMonth._id);
    }
  }, [currentMonth]);

  useEffect(() => {
    // handles week balance
    if (currentMonth && 'weekLimitAmount' in currentMonth) {
      const isCurrentMonth = isSameMonth(new Date(), currentMonth.createdAt!);
      const numberOfDaysFromPreviousMonth: number =
        getNumberOfDaysFromPreviousMonth();
      const weekDaysFromThisMonth: number[] = getWeekDaysOfCurrentMonth();

      const totalExpensesOfPreviousMonthWeekDays =
        getTotalExpensesOfLastMonthWeekDays(
          numberOfDaysFromPreviousMonth,
          userMonths,
        );
      const totalExpensesOfThisMonthWeekDays =
        getTotalExpensesOfThisMonthWeekDays(
          weekDaysFromThisMonth,
          currentMonth as IMonth,
        );
      const totalWeekExpenses =
        totalExpensesOfPreviousMonthWeekDays + totalExpensesOfThisMonthWeekDays;

      setSpentThisWeek(totalWeekExpenses);
      setWeekBalance(currentMonth.weekLimitAmount! - totalWeekExpenses);
      setWeekLimit(currentMonth.weekLimitAmount!);
      setShowWeekBalance(isCurrentMonth);
    }
  }, [currentMonth, userMonths]);

  return (
    <section className='w-full sm:w-80'>
      {currentMonth && userMonths.length > 0 && (
        <div className='w-full'>
          <MonthYearHeader
            userMonthsYears={userMonths}
            index={monthIndex}
            currentMonthYear={currentMonth}
            setCurrentMonthYear={setCurrentMonth}
            setIndex={setMonthIndex}
          />

          {showWeekBalance && (
            <WeekBalanceSection
              weekBalance={weekBalance}
              weekLimit={weekLimit}
              spentThisWeek={spentThisWeek}
            />
          )}

          <MonthEvents
            events={currentMonth.incomes}
            eventType={APP.eventType.income}
            monthId={monthId}
          />
          <MonthEvents
            events={currentMonth.expenses}
            eventType={APP.eventType.expense}
            monthId={monthId}
          />
        </div>
      )}
    </section>
  );
}

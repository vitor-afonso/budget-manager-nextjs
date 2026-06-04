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
  getWeekExpenseCategories,
} from '@/utils/app.methods';
import { useWeekExcludedCategories } from '@/app/hooks/useWeekExcludedCategories';
import MonthEvents from '@/components/MonthEvents/MonthEvents';
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
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [weekCategories, setWeekCategories] = useState<string[]>([]);
  const { excludedCategories, toggleCategory, isExcluded } =
    useWeekExcludedCategories();

  useEffect(() => {
    if (user) {
      handleUserData();
    }
  }, [user]);

  // to set the current month on first load
  useEffect(() => {
    if (userMonths.length > 0 && isFirstRender) {
      setIsFirstRender(false);
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

  // keep currentMonth in sync when userMonths updates (after create/edit/delete)
  useEffect(() => {
    if (!isFirstRender && monthId) {
      const updated = userMonths.find((m) => m._id === monthId);
      if (updated) setCurrentMonth(updated);
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
      const excluded = Array.from(excludedCategories);

      setWeekCategories(
        getWeekExpenseCategories(
          weekDaysFromThisMonth,
          currentMonth as IMonth,
          numberOfDaysFromPreviousMonth,
          userMonths,
        ),
      );

      const totalExpensesOfPreviousMonthWeekDays =
        getTotalExpensesOfLastMonthWeekDays(
          numberOfDaysFromPreviousMonth,
          userMonths,
          excluded,
        );
      const totalExpensesOfThisMonthWeekDays =
        getTotalExpensesOfThisMonthWeekDays(
          weekDaysFromThisMonth,
          currentMonth as IMonth,
          excluded,
        );
      const totalWeekExpenses =
        totalExpensesOfPreviousMonthWeekDays + totalExpensesOfThisMonthWeekDays;

      setSpentThisWeek(totalWeekExpenses);
      setWeekBalance(currentMonth.weekLimitAmount! - totalWeekExpenses);
      setWeekLimit(currentMonth.weekLimitAmount!);
      setShowWeekBalance(isCurrentMonth);
    }
  }, [currentMonth, userMonths, excludedCategories]);

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
              categories={weekCategories}
              isExcluded={isExcluded}
              onToggleCategory={toggleCategory}
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

'use client';
import React, { useContext, useEffect, useState } from 'react';
import { isSameMonth } from 'date-fns';
import MonthCategoryGraph from '@/components/MonthCategoryGraph';
import { IMonth, IYear } from '@/types/models';
import { IUserDataContext, UserDataContext } from '@/app/context/userData.context';
import { APP } from '@/utils/app.constants';
import MonthYearHeader from '@/components/MonthYearHeader';

const MonthInfo = () => {
  const { userMonths } = useContext(UserDataContext) as IUserDataContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | IYear | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);

  // set current month
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
      }
    }
  }, [userMonths]);

  return (
    <div className='flex flex-col items-center'>
      {currentMonth ? (
        <>
          <MonthYearHeader userMonthsYears={userMonths} index={monthIndex} currentMonthYear={currentMonth} setCurrentMonthYear={setCurrentMonth} setIndex={setMonthIndex} />
          <MonthCategoryGraph incomeExpenseList={currentMonth.incomes} categoryType={APP.eventType.income} />
          <MonthCategoryGraph incomeExpenseList={currentMonth.expenses} categoryType={APP.eventType.expense} />
        </>
      ) : (
        <p>No month available to be displayed</p>
      )}
    </div>
  );
};

export default MonthInfo;

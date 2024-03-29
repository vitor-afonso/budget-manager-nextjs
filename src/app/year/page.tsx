'use client';

import { useContext, useEffect, useState } from 'react';
import { isSameYear } from 'date-fns';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import { IYear } from '@/types/models';
import MonthYearHeader from '@/components/MonthYearHeader';
import { APP } from '@/utils/app.constants';
import YearCategoriesGraph from '@/components/YearCategoryGraph';
import YearCategoryTotals from '@/components/YearCategoryTotals';

function YearInfo() {
  const { userYears, userMonths } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [currentYear, setCurrentYear] = useState<IYear | null>(null);
  const [yearIndex, setYearIndex] = useState<number | null>(null);
  const [allOpenMonths, setAllOpenMonths] = useState<Date[] | null>(null);

  // set current month
  useEffect(() => {
    if (userYears) {
      const year = userYears.find((oneYear, i) => {
        if (isSameYear(new Date(), oneYear.createdAt!)) {
          setYearIndex(i);
          return oneYear;
        }
        return undefined;
      });

      if (year) {
        setCurrentYear(year);
      }

      setAllOpenMonths(userMonths.map((month) => month.createdAt));
    }
  }, [userYears, userMonths]);

  return (
    <div className='flex flex-col items-center'>
      {currentYear ? (
        <>
          <MonthYearHeader
            userMonthsYears={userYears}
            index={yearIndex}
            currentMonthYear={currentYear}
            eventType={APP.eventType.year}
            setCurrentMonthYear={setCurrentYear}
            setIndex={setYearIndex}
          />
          <YearCategoriesGraph
            currentYear={currentYear}
            allOpenMonths={allOpenMonths!}
          />
          <YearCategoryTotals
            eventType={APP.eventType.income}
            incomesExpenses={currentYear.incomes}
          />
          <YearCategoryTotals
            eventType={APP.eventType.expense}
            incomesExpenses={currentYear.expenses}
          />
        </>
      ) : (
        <p>No year data available to display.</p>
      )}
    </div>
  );
}

export default YearInfo;

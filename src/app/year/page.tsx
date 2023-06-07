'use client';
import { useContext, useEffect, useState } from 'react';
import { isSameYear } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { IYear } from '@/types/models';
import MonthYearHeader from '@/components/MonthYearHeader';
import { APP } from '@/utils/app.constants';
import YearCategoriesGraph from '@/components/YearCategoryGraph';
import YearCategoryTotals from '@/components/YearCategoryTotals';

const YearInfo = () => {
  const { userYears } = useContext(AuthContext) as IAppContext;
  const [currentYear, setCurrentYear] = useState<IYear | null>(null);
  const [yearIndex, setYearIndex] = useState<number | null>(null);

  // set current month
  useEffect(() => {
    if (userYears) {
      let year = userYears.find((oneYear, i) => {
        if (isSameYear(new Date(), oneYear.createdAt!)) {
          setYearIndex(i);
          return oneYear;
        }
      });

      if (year) {
        setCurrentYear(year);
      }
    }
  }, [userYears]);

  return (
    <div className='flex flex-col items-center'>
      {currentYear ? (
        <>
          <MonthYearHeader userMonthsYears={userYears} index={yearIndex} currentMonthYear={currentYear} eventType={APP.eventType.year} setCurrentMonthYear={setCurrentYear} setIndex={setYearIndex} />
          <YearCategoriesGraph currentYear={currentYear} />
          <YearCategoryTotals eventType={APP.eventType.income} incomesExpenses={currentYear.incomes} />
          <YearCategoryTotals eventType={APP.eventType.expense} incomesExpenses={currentYear.expenses} />
        </>
      ) : (
        <p>No year available to display.</p>
      )}
    </div>
  );
};

export default YearInfo;

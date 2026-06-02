'use client';

import { useContext, useEffect, useState } from 'react';
import { isSameMonth } from 'date-fns';
import { useTranslations } from 'next-intl';
import MonthCategoryGraph from '@/components/MonthCategoryGraph';
import { IMonth, IYear } from '@/types/models';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import { APP } from '@/utils/app.constants';
import MonthYearHeader from '@/components/MonthYearHeader';

function NoMonthMessage() {
  const t = useTranslations('pages');
  return <p>{t('noMonthAvailable')}</p>;
}

function MonthInfo() {
  const { userMonths } = useContext(UserDataContext) as IUserDataContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | IYear | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);

  // set current month
  useEffect(() => {
    if (userMonths.length > 0) {
      const month = userMonths.find((oneMonth, i) => {
        if (isSameMonth(new Date(), oneMonth.createdAt)) {
          setMonthIndex(i);
          return oneMonth;
        }
        return undefined;
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
          <MonthYearHeader
            userMonthsYears={userMonths}
            index={monthIndex}
            currentMonthYear={currentMonth}
            setCurrentMonthYear={setCurrentMonth}
            setIndex={setMonthIndex}
          />
          <MonthCategoryGraph
            incomeExpenseList={currentMonth.incomes}
            categoryType={APP.eventType.income}
          />
          <MonthCategoryGraph
            incomeExpenseList={currentMonth.expenses}
            categoryType={APP.eventType.expense}
          />
        </>
      ) : (
        <NoMonthMessage />
      )}
    </div>
  );
}

export default MonthInfo;

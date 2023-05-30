'use client';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { compareAsc, isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { IMonth } from '@/types/models';
import { calculateTotal, getEventCreationDate, getMonthBalance } from '@/utils/app.methods';
import { APP } from '@/utils/app.constants';
import MonthEvents from '@/components/MonthEvents';

export default function Month(): JSX.Element {
  const { userMonths, isLoadingContext } = useContext(AuthContext) as IAppContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);
  const { currency } = APP;

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

  const changeMonth = (buttonAction: string) => {
    if (monthIndex !== null && monthIndex > 0 && buttonAction === APP.buttonAction.prev) {
      setMonthIndex(monthIndex - 1);
      setCurrentMonth(userMonths[monthIndex - 1]);
      return;
    }

    if (monthIndex !== null && monthIndex < userMonths.length - 1 && buttonAction === APP.buttonAction.next) {
      setMonthIndex(monthIndex + 1);
      setCurrentMonth(userMonths[monthIndex + 1]);
      return;
    }
  };

  return (
    <section className='w-full sm:w-80'>
      {currentMonth && userMonths.length > 0 && (
        <div className='w-full'>
          <div className='flex flex-col p-4 items-center justify-around h-40 border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300'>
            <div className='flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100 mb-2'>
              <button
                onClick={() => {
                  changeMonth(APP.buttonAction.prev);
                }}
              >
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='3' stroke='currentColor' className={clsx(monthIndex === 0 && 'text-gray-300', 'w-6 h-6')}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>

              <div className='flex flex-col text-center '>
                <h2 className='font-semibold'>{getEventCreationDate(currentMonth.createdAt, APP.eventType.month).replace('-', '/')} Balance</h2>
                <span className={clsx(getMonthBalance(currentMonth) >= 0 ? 'text-green-500' : 'text-red-500', 'font-semibold')}>{getMonthBalance(currentMonth).toFixed(2) + currency}</span>
              </div>
              <button
                onClick={() => {
                  changeMonth(APP.buttonAction.next);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='3'
                  stroke='currentColor'
                  className={clsx(monthIndex! === userMonths.length - 1 && 'text-gray-300', 'w-6 h-6')}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            </div>
            <div className='flex justify-between items-center w-full'>
              <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
                <h6 className='font-medium'>Income</h6>
                <span className='text-green-500'>{calculateTotal(currentMonth.incomes)}</span>
              </div>
              <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
                <h6 className='font-medium'>Expense</h6>
                <span className='text-red-500'>{calculateTotal(currentMonth.expenses)}</span>
              </div>
            </div>
          </div>
          <MonthEvents events={currentMonth.incomes} eventType={APP.eventType.income} />
          <MonthEvents events={currentMonth.expenses} eventType={APP.eventType.expense} />
        </div>
      )}
    </section>
  );
}

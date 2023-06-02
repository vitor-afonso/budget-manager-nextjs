import React, { useContext } from 'react';
import clsx from 'clsx';
import { calculateTotal, changeMonthYear, getEventCreationDate, getMonthBalance } from '@/utils/app.methods';
import { APP } from '@/utils/app.constants';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { IMonth } from '@/types/models';

interface IProps {
  currentMonthYear: IMonth | null;
  index: number | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentMonthYear: React.Dispatch<React.SetStateAction<IMonth | null>>;
}

const MonthYearHeader = ({ currentMonthYear, index, setIndex, setCurrentMonthYear }: IProps) => {
  const { userMonths } = useContext(AuthContext) as IAppContext;
  return (
    <div className='flex flex-col p-4 items-center justify-around h-40 border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300'>
      <div className='flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100 mb-2'>
        <button
          onClick={() => {
            changeMonthYear(APP.buttonAction.prev, userMonths, index, setIndex, setCurrentMonthYear);
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='3' stroke='currentColor' className={clsx(index === 0 && 'text-gray-300', 'w-6 h-6')}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>

        <div className='flex flex-col text-center '>
          <h2 className='font-semibold'>{getEventCreationDate(currentMonthYear!.createdAt, APP.eventType.month).replace('-', '/')} Balance</h2>
          <span className={clsx(getMonthBalance(currentMonthYear!) >= 0 ? 'text-green-500' : 'text-red-500', 'font-semibold')}>{getMonthBalance(currentMonthYear!).toFixed(2) + APP.currency}</span>
        </div>
        <button
          onClick={() => {
            changeMonthYear(APP.buttonAction.next, userMonths, index, setIndex, setCurrentMonthYear);
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='3'
            stroke='currentColor'
            className={clsx(index! === userMonths.length - 1 && 'text-gray-300', 'w-6 h-6')}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
          <h6 className='font-medium'>Income</h6>
          <span className='text-green-500'>{calculateTotal(currentMonthYear!.incomes)}</span>
        </div>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
          <h6 className='font-medium'>Expense</h6>
          <span className='text-red-500'>{calculateTotal(currentMonthYear!.expenses)}</span>
        </div>
      </div>
    </div>
  );
};

export default MonthYearHeader;

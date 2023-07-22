import React from 'react';
import clsx from 'clsx';
import { calculateTotal, changeMonthYear, getEventCreationDate, getMonthBalance } from '@/utils/app.methods';
import { APP } from '@/utils/app.constants';
import { IMonth, IYear } from '@/types/models';

interface IProps {
  userMonthsYears: IMonth[] | IYear[];
  currentMonthYear: IMonth | IYear | null;
  index: number | null;
  eventType?: string | null;
  setIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentMonthYear: React.Dispatch<React.SetStateAction<IMonth | IYear | null>>;
}

const MonthYearHeader = ({ userMonthsYears, currentMonthYear, index, eventType, setIndex, setCurrentMonthYear }: IProps) => {
  const currentMonthBalance = getMonthBalance(currentMonthYear!);

  return (
    <div className='flex flex-col p-4 items-center justify-around h-40 border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300'>
      <div className='flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100 mb-2'>
        <button
          onClick={() => {
            changeMonthYear(userMonthsYears, APP.buttonAction.prev, index, setIndex, setCurrentMonthYear);
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='3' stroke='currentColor' className={clsx(index === 0 && 'text-gray-300', 'w-6 h-6')}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
          </svg>
        </button>

        <div className='flex flex-col text-center text-md font-semibold'>
          <h2>{getEventCreationDate(currentMonthYear!.createdAt!, eventType ? APP.eventType.year : APP.eventType.month).replace('-', '/')} Balance</h2>
          <span className={clsx(currentMonthBalance >= 0 ? 'text-green-500' : 'text-red-500')}>{APP.currency.format(currentMonthBalance)}</span>
        </div>
        <button
          onClick={() => {
            changeMonthYear(userMonthsYears, APP.buttonAction.next, index, setIndex, setCurrentMonthYear);
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='3'
            stroke='currentColor'
            className={clsx(index! === userMonthsYears.length - 1 && 'text-gray-300', 'w-6 h-6')}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
          <h6 className='font-medium capitalize'>{APP.eventType.income}</h6>
          <span className='text-green-500'>{APP.currency.format(calculateTotal(currentMonthYear!.incomes))}</span>
        </div>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100'>
          <h6 className='font-medium capitalize'>{APP.eventType.expense}</h6>
          <span className='text-red-500'>{APP.currency.format(calculateTotal(currentMonthYear!.expenses))}</span>
        </div>
      </div>
    </div>
  );
};

export default MonthYearHeader;

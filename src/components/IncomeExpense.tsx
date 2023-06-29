import React from 'react';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';

interface Props {
  incomeExpense: IIncome | IExpense;
  eventType: string;
}

export function IncomeExpense({ incomeExpense, eventType }: Props) {
  return (
    <div className='flex justify-between items-center mb-2 last:mb-0 '>
      <div className='text-left leading-none '>
        <p className='text-md truncate capitalize'>{'title' in incomeExpense ? incomeExpense.title : incomeExpense.category}</p>
        <span className='text-xs'>{getEventCreationDate(incomeExpense.createdAt, eventType)}</span>
      </div>
      <div className='flex items-center text-md'>
        <p>{incomeExpense.amount + APP.currency}</p>
        <button className='rounded-full bg-slate-300 w-5 h-5 flex justify-center items-center mx-1'>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='5' stroke='currentColor' className='w-4 h-4 text-red-500'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
          </svg>
        </button>
      </div>
    </div>
  );
}

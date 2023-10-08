import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getCategoryTotals } from '@/utils/app.methods';
import clsx from 'clsx';
import React from 'react';

const BIG_SCREEN_MIN_HEIGHT = 800;

const YearCategoryTotals = ({ incomesExpenses, eventType }: { incomesExpenses: IIncome[] | IExpense[]; eventType: string }) => {
  const { categoryTotals } = getCategoryTotals(incomesExpenses);
  const categoryNames = Array.from(categoryTotals.keys());
  const categoryAmounts = Array.from(categoryTotals.values());

  return (
    <div className='flex flex-col justify-between pb-4 border border-black max-h-64 rounded-3xl mt-4 bg-slate-200 w-full'>
      <div className='mb-2 w-full'>
        <div className='border border-black text-xl rounded-3xl h-10 w-full flex items-center justify-center bg-slate-100'>
          <h2>{eventType === APP.eventType.income ? 'Incomes ' : 'Expenses '} by category</h2>
        </div>
        <div className={clsx(screen.height < BIG_SCREEN_MIN_HEIGHT ? 'max-h-20' : 'max-h-32', 'pb-2 pl-5 mt-5 mr-5 overflow-y-auto')}>
          {categoryNames.map((oneName, i) => (
            <div key={`${oneName}${i}`} className='flex justify-between items-center mb-2 last:mb-0 '>
              <div className='text-left leading-none '>
                <p className='text-md truncate capitalize'>{oneName}</p>
              </div>
              <div className='flex items-center text-md'>
                <p>{APP.currency.format(categoryAmounts[i])}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearCategoryTotals;

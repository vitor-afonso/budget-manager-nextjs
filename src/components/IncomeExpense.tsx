import React, { useContext, useState } from 'react';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';
import ModalCustom from '@/components/ModalCustom';
import { deleteIncomeExpense } from '@/services/incomesExpenses';
import { AuthContext, IAppContext } from '@/app/auth.context';

interface Props {
  incomeExpense: IIncome | IExpense;
  eventType: string;
}

export function IncomeExpense({ incomeExpense, eventType }: Props) {
  const { updateMonthIncomeExpenseDeletion } = useContext(AuthContext) as IAppContext;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isExpense = 'title' in incomeExpense;
  const incomeExpenseName = isExpense ? incomeExpense.title : incomeExpense.category;
  const getAmountToDisplay = (amount: number) => {
    if (amount % 1 === 0) {
      return amount;
    }
    return amount.toFixed(2);
  };
  const handleDeleteIncomeExpense = async () => {
    try {
      const response = await deleteIncomeExpense(incomeExpense._id, isExpense);
      updateMonthIncomeExpenseDeletion(incomeExpense._id, incomeExpense.monthId, isExpense);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex justify-between items-center mb-2 last:mb-0 '>
      <div className='text-left leading-none '>
        <p className='text-md truncate capitalize'>{isExpense ? incomeExpense.title : incomeExpense.category}</p>
        <span className='text-xs'>{getEventCreationDate(incomeExpense.createdAt, eventType)}</span>
      </div>
      <div className='flex items-center text-md'>
        <p>{getAmountToDisplay(incomeExpense.amount) + APP.currency}</p>
        <button className='rounded-full bg-slate-300 w-5 h-5 flex justify-center items-center mx-1' onClick={() => setIsModalOpen(true)}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='5' stroke='currentColor' className='w-4 h-4 text-red-500'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
          </svg>
        </button>
      </div>

      {isModalOpen && <ModalCustom setIsModalOpen={setIsModalOpen} mainFunction={handleDeleteIncomeExpense} question={incomeExpenseName} buttonText={'Delete'} />}
    </div>
  );
}

import { useContext, useState } from 'react';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';
import ModalCustom from '@/components/ModalCustom';
import { deleteIncomeExpense } from '@/services/incomesExpenses.services';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';

interface Props {
  incomeExpense: IIncome | IExpense;
  eventType: string;
}

export function IncomeExpense({ incomeExpense, eventType }: Props) {
  const { updateMonthIncomeExpenseDeletion } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isExpense = 'title' in incomeExpense;
  const incomeExpenseName = isExpense
    ? incomeExpense.title
    : incomeExpense.category;

  const handleDeleteIncomeExpense = async () => {
    try {
      await deleteIncomeExpense(incomeExpense._id, isExpense);
      updateMonthIncomeExpenseDeletion(
        incomeExpense._id,
        incomeExpense.monthId,
        isExpense,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <div className='flex justify-between items-center mb-2 last:mb-0 '>
      <div className='text-left leading-none '>
        <p className='text-md truncate capitalize'>
          {isExpense ? incomeExpense.title : incomeExpense.category}
        </p>
        <span className='text-xs'>
          {getEventCreationDate(incomeExpense.createdAt, eventType)}
        </span>
      </div>
      <div className='flex items-center text-md'>
        <div className='text-right leading-none'>
          <p>{APP.currency.format(incomeExpense.amount)}</p>
          {isExpense && (
            <span className='text-xs capitalize'>{incomeExpense.category}</span>
          )}
        </div>
        <button
          type='button'
          className='rounded-full bg-slate-300 w-5 h-5 flex justify-center items-center mx-1'
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='5'
            stroke='currentColor'
            className='w-4 h-4 text-red-500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 12h-15'
            />
          </svg>
        </button>
      </div>

      {isModalOpen && (
        <ModalCustom
          setIsModalOpen={setIsModalOpen}
          mainFunction={handleDeleteIncomeExpense}
          question={incomeExpenseName}
          buttonText='Delete'
        />
      )}
    </div>
  );
}

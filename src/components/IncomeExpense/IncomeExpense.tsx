import { useContext, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';
import ModalCustom from '@/components/ModalCustom';
import ModalCreateIncomeExpense from '@/components/ModalCreateIncomeExpense/ModalCreateIncomeExpense';
import { deleteIncomeExpense } from '@/services/incomesExpenses.services';
import { toast } from 'sonner';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isActionsOpen, setIsActionsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [marqueeOffset, setMarqueeOffset] = useState<number | null>(null);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = containerRef.current;
        const text = nameRef.current;
        if (!container || !text) return;
        const overflow = text.offsetWidth - container.clientWidth;
        if (overflow > 0) {
          setMarqueeOffset(-overflow);
        }
      });
    });
  }, []);
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
      toast.success(`${isExpense ? 'Expense' : 'Income'} deleted successfully`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='flex justify-between items-center mb-2 last:mb-0 '>
      <div className='text-left leading-none min-w-0 flex-1 mr-2'>
        <div ref={containerRef} className='overflow-hidden'>
          <span
            ref={nameRef}
            className={`text-md capitalize whitespace-nowrap inline-block${
              marqueeOffset !== null ? ' marquee-animate' : ''
            }`}
            style={
              marqueeOffset !== null
                ? ({
                    '--marquee-offset': `${marqueeOffset}px`,
                  } as CSSProperties)
                : {}
            }
          >
            {isExpense ? incomeExpense.title : incomeExpense.category}
          </span>
        </div>
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

        <div className='relative ml-1'>
          <button
            type='button'
            className='rounded-full bg-slate-300 w-5 h-5 flex justify-center items-center'
            onClick={() => setIsActionsOpen((prev) => !prev)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
              className='w-3 h-3 text-slate-700'
            >
              <circle cx='5' cy='12' r='1.5' />
              <circle cx='12' cy='12' r='1.5' />
              <circle cx='19' cy='12' r='1.5' />
            </svg>
          </button>

          {isActionsOpen && (
            <>
              <div
                role='button'
                tabIndex={-1}
                aria-label='Close actions'
                className='fixed inset-0 z-10'
                onClick={() => setIsActionsOpen(false)}
                onKeyDown={() => setIsActionsOpen(false)}
              />
              <div className='absolute right-0 bottom-6 z-20 flex flex-col bg-slate-600 border border-slate-700 rounded-xl shadow-lg overflow-hidden min-w-[80px]'>
                <button
                  type='button'
                  className='px-3 py-2 text-xs text-left text-gray-200 hover:bg-slate-500 flex items-center gap-2'
                  onClick={() => {
                    setIsActionsOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    className='w-3 h-3'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z'
                    />
                  </svg>
                  Edit
                </button>
                <button
                  type='button'
                  className='px-3 py-2 text-xs text-left text-red-400 hover:bg-slate-500 flex items-center gap-2'
                  onClick={() => {
                    setIsActionsOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2.5'
                    stroke='currentColor'
                    className='w-3 h-3'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ModalCustom
          setIsModalOpen={setIsModalOpen}
          mainFunction={handleDeleteIncomeExpense}
          question={incomeExpenseName}
          buttonText='Delete'
        />
      )}

      {isEditModalOpen && (
        <ModalCreateIncomeExpense
          setIsModalOpen={setIsEditModalOpen}
          monthId={incomeExpense.monthId}
          eventType={eventType}
          existingItem={incomeExpense}
        />
      )}
    </div>
  );
}

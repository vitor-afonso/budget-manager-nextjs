'use client';

import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { IExpense, IIncome } from '@/types/models';
import { getCurrencyFormatter } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';
import ModalCustom from '@/components/ModalCustom';
import ModalCreateIncomeExpense from '@/components/ModalCreateIncomeExpense/ModalCreateIncomeExpense';
import { deleteIncomeExpense } from '@/services/incomesExpenses.services';
import { toast } from 'sonner';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import { useLocale } from '@/app/providers/LocaleProvider';

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
  const [dropdownPos, setDropdownPos] = useState<{
    bottom: number;
    right: number;
  } | null>(null);
  const actionsBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [marqueeOffset, setMarqueeOffset] = useState<number | null>(null);
  const t = useTranslations('events');
  const { locale } = useLocale();
  const currency = getCurrencyFormatter(locale);

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
      toast.success(
        isExpense ? t('expenseDeletedSuccess') : t('incomeDeletedSuccess'),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error(t('somethingWentWrong'));
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
          <p>{currency.format(incomeExpense.amount)}</p>
          {isExpense && (
            <span className='text-xs capitalize'>{incomeExpense.category}</span>
          )}
        </div>

        <div className='relative ml-1 shrink-0'>
          <button
            ref={actionsBtnRef}
            type='button'
            className='rounded-full bg-slate-300 w-9 h-9 flex justify-center items-center'
            onClick={() => {
              if (!isActionsOpen && actionsBtnRef.current) {
                const rect = actionsBtnRef.current.getBoundingClientRect();
                setDropdownPos({
                  bottom: window.innerHeight - rect.top + 4,
                  right: window.innerWidth - rect.right,
                });
              }
              setIsActionsOpen((prev) => !prev);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
              className='w-4 h-4 text-slate-700'
            >
              <circle cx='5' cy='12' r='1.5' />
              <circle cx='12' cy='12' r='1.5' />
              <circle cx='19' cy='12' r='1.5' />
            </svg>
          </button>

          {isActionsOpen &&
            dropdownPos &&
            createPortal(
              <>
                <div
                  role='button'
                  tabIndex={-1}
                  aria-label={t('closeActions')}
                  className='fixed inset-0 z-40'
                  onClick={() => setIsActionsOpen(false)}
                  onKeyDown={() => setIsActionsOpen(false)}
                />
                <div
                  className='fixed z-50 flex flex-col bg-slate-600 border border-slate-700 rounded-xl shadow-lg overflow-hidden min-w-[148px]'
                  style={{
                    bottom: dropdownPos.bottom,
                    right: dropdownPos.right,
                  }}
                >
                  <button
                    type='button'
                    className='min-h-11 px-5 py-3.5 text-base text-left text-gray-200 hover:bg-slate-500 flex items-center gap-3'
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
                      className='w-5 h-5 shrink-0'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.213l-4.5 1.125 1.125-4.5L16.862 3.487z'
                      />
                    </svg>
                    {t('edit')}
                  </button>
                  <button
                    type='button'
                    className='min-h-11 px-5 py-3.5 text-base text-left text-red-400 hover:bg-slate-500 flex items-center gap-3'
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
                      className='w-5 h-5 shrink-0'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                    {t('delete')}
                  </button>
                </div>
              </>,
              document.body,
            )}
        </div>
      </div>

      {isModalOpen && (
        <ModalCustom
          setIsModalOpen={setIsModalOpen}
          mainFunction={handleDeleteIncomeExpense}
          question={incomeExpenseName}
          buttonText={t('delete')}
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

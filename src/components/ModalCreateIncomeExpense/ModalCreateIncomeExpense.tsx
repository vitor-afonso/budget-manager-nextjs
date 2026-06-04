/* eslint-disable react/jsx-props-no-spreading */

'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { APP } from '@/utils/app.constants';
import {
  createIncomeExpense,
  updateIncomeExpense,
} from '@/services/incomesExpenses.services';
import { toast } from 'sonner';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import Button from '@/components/Button';
import InputText from '@/components/InputText';
import InputDate from '@/components/InputDate';
import Spinner from '@/components/Spinner';
import { getDistinctCategories, getDistinctTitles } from '@/utils/app.methods';
import { format } from 'date-fns';
import { IExpense, IIncome } from '@/types/models';
import { useFormRules } from '@/app/hooks/useFormRules';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  monthId: string;
  eventType: string;
  existingItem?: IIncome | IExpense;
}
const schema = z.object({
  title: z.string().optional(),
  category: z.string(),
  amount: z.string().transform((val) => Number(val)),
  creationDate: z.date(),
});
type FormData = z.infer<typeof schema>;

function ModalCreateIncomeExpense({
  setIsModalOpen,
  monthId,
  eventType,
  existingItem,
}: Props) {
  const {
    updateMonthIncomeExpenseCreation,
    updateMonthIncomeExpenseEdit,
    userMonths,
  } = useContext(UserDataContext) as IUserDataContext;
  const isEditMode = !!existingItem;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date | null>(null);
  const t = useTranslations('events');
  const formRules = useFormRules();
  const categories = useMemo(
    () => getDistinctCategories(userMonths ?? [], eventType),
    [userMonths, eventType],
  );
  const titles = useMemo(
    () => getDistinctTitles(userMonths ?? []),
    [userMonths],
  );
  const isExpense = eventType === APP.eventType.expense;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: existingItem
      ? {
          title: isExpense ? (existingItem as IExpense).title : undefined,
          category: existingItem.category,
          amount: String(existingItem.amount) as unknown as number,
          creationDate: format(
            new Date(existingItem.createdAt),
            'yyyy-MM-dd',
          ) as unknown as Date,
        }
      : undefined,
  });

  useEffect(() => {
    if (userMonths) {
      const monthDate = userMonths.find((month) => month._id === monthId)
        ?.createdAt;
      if (monthDate) setCurrentMonthDate(monthDate);
    }
  }, [userMonths, monthId]);

  const handleSubmitIncomeExpense = async (formData: FormData) => {
    if (!monthId) return;

    setIsLoading(true);
    try {
      const requestBody = {
        ...formData,
        category: formData.category.toLowerCase(),
        monthId,
      };

      if (isEditMode && existingItem) {
        const updatedIncomeExpense = await updateIncomeExpense(
          existingItem._id,
          requestBody,
          isExpense,
        );
        updateMonthIncomeExpenseEdit(updatedIncomeExpense, monthId);
        toast.success(
          isExpense ? t('expenseUpdatedSuccess') : t('incomeUpdatedSuccess'),
        );
      } else {
        const createdIncomeExpense = await createIncomeExpense(
          requestBody,
          isExpense,
        );
        updateMonthIncomeExpenseCreation(createdIncomeExpense, monthId);
        toast.success(
          isExpense ? t('expenseAddedSuccess') : t('incomeAddedSuccess'),
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      toast.error(t('somethingWentWrong'));
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 z-10 w-screen h-screen '>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='text-gray-300 uppercase font-semibold'>
          {isEditMode ? `${t('edit')} ` : ''}
          {isExpense ? t('expense') : t('income')}
        </p>

        <form
          onSubmit={handleSubmit(handleSubmitIncomeExpense)}
          className='space-y-2 w-full'
        >
          {isExpense && (
            <InputText
              register={register}
              errors={errors}
              inputName={APP.inputName.title}
              inputRules={formRules.title}
              suggestions={titles}
              disabled={isLoading}
            />
          )}

          <InputText
            register={register}
            errors={errors}
            inputName={APP.inputName.category}
            inputRules={formRules.category}
            suggestions={categories}
            disabled={isLoading}
          />

          <InputText
            register={register}
            errors={errors}
            inputName={APP.inputName.amount}
            inputRules={formRules.amount}
            disabled={isLoading}
          />

          {currentMonthDate && (
            <InputDate
              register={register}
              errors={errors}
              inputName='creationDate'
              monthDate={currentMonthDate}
              disabled={isLoading}
            />
          )}

          <br />
          {isLoading ? (
            <Spinner />
          ) : (
            <Button>{isEditMode ? t('save') : t('add')}</Button>
          )}
        </form>
      </div>

      <div
        role='button'
        onClick={() => setIsModalOpen(false)}
        onKeyDown={() => setIsModalOpen(false)}
        aria-label={t('closeModal')}
        tabIndex={0}
        className='bg-black/50 w-full h-full absolute z-20'
      />
    </div>
  );
}

export default ModalCreateIncomeExpense;

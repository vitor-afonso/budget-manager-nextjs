'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { APP } from '@/utils/app.constants';
import { createIncomeExpense } from '@/services/incomesExpenses';
import { IUserDataContext, UserDataContext } from '@/app/context/userData.context';
import Button from '@/components/Button';
import InputText from '@/components/InputText';
import InputDate from '@/components/InputDate';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  monthId: string;
  eventType: string;
}
const schema = z.object({
  title: z.string().optional(),
  category: z.string(),
  amount: z.string().transform((val) => Number(val)),
  creationDate: z.date(),
});
//get type from schema
type FormData = z.infer<typeof schema>;

const ModalCreateIncomeExpense = ({ setIsModalOpen, monthId, eventType }: Props) => {
  const { updateMonthIncomeExpenseCreation, userMonths } = useContext(UserDataContext) as IUserDataContext;
  const [currentMonthDate, setCurrentMonthDate] = useState<Date | null | undefined>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const isExpense = eventType === APP.eventType.expense;

  useEffect(() => {
    if (userMonths) {
      const monthDate = userMonths.find((month) => month._id === monthId)?.createdAt;
      if (monthDate) setCurrentMonthDate(monthDate);
    }
  }, [userMonths, monthId]);

  const handleCreateMonth = async (formData: FormData) => {
    if (!monthId) return;

    try {
      const requestBody = {
        ...formData,
        category: formData.category.toLowerCase(),
        monthId,
      };

      const createdIncomeExpense = await createIncomeExpense(requestBody, isExpense);
      updateMonthIncomeExpenseCreation(createdIncomeExpense, monthId);
    } catch (error) {
      console.log(error);
      // setErrorMessage(error)
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className='absolute top-0 left-0 z-10 w-screen h-screen '>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='text-gray-300 uppercase font-semibold'>{isExpense ? APP.eventType.expense : APP.eventType.income}</p>

        <form onSubmit={handleSubmit(handleCreateMonth)} className='space-y-2 w-full'>
          {isExpense && <InputText register={register} errors={errors} inputName={APP.inputName.title} inputRules={APP.formRules.title} />}

          <InputText register={register} errors={errors} inputName={APP.inputName.category} inputRules={APP.formRules.category} />

          <InputText register={register} errors={errors} inputName={APP.inputName.amount} inputRules={APP.formRules.amount} />

          {currentMonthDate && <InputDate register={register} errors={errors} inputName='creationDate' monthDate={currentMonthDate} />}

          <br />
          <Button>Add</Button>
        </form>
      </div>

      <div className='bg-black/50 w-full h-full absolute z-20' onClick={() => setIsModalOpen(false)}></div>
    </div>
  );
};

export default ModalCreateIncomeExpense;

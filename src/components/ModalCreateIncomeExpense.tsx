import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { APP } from '@/utils/app.constants';
import { createIncomeExpense } from '@/services/incomesExpenses';
import { AuthContext, IAppContext } from '@/app/auth.context';

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
  const { updateMonthIncomeExpenseCreation } = useContext(AuthContext) as IAppContext;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const isExpense = eventType === APP.eventType.expense;

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
        <p className='text-gray-200'>{isExpense ? 'Add expense' : 'Add income'}</p>

        <form onSubmit={handleSubmit(handleCreateMonth)}>
          {isExpense && (
            <label>
              <p>Title</p>
              <input {...register('title', { required: 'Title is required' })} />
            </label>
          )}
          {errors.title?.message && <p className='text-red-500 font-bold text-sm'>{errors.title.message}</p>}
          <label>
            <p>Category</p>
            <input {...register('category', { required: 'Category is required' })} />
          </label>
          {errors.category?.message && <p className='text-red-500 font-bold text-sm'>{errors.category.message}</p>}

          <label>
            <p>Amount</p>
            <input
              {...register('amount', {
                required: 'Amount is required',
                pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Invalid value' },
              })}
            />
          </label>
          {errors.amount?.message && <p className='text-red-500 font-bold text-sm'>{errors.amount.message}</p>}

          <label>
            <p>Date</p>
            <input
              type='date'
              {...register('creationDate', {
                required: 'Date is required',
              })}
            />
          </label>
          {errors.creationDate?.message && <p className='text-red-500 font-bold text-sm'>{errors.creationDate.message}</p>}
          <br />
          <input type='submit' />
        </form>
      </div>

      <div className='bg-black/50 w-full h-full absolute z-20' onClick={() => setIsModalOpen(false)}></div>
    </div>
  );
};

export default ModalCreateIncomeExpense;

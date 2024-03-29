/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isSameMonth } from 'date-fns';
import { z } from 'zod';
import { APP } from '@/utils/app.constants';
import Button from '@/components/Button';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { createMonth } from '@/services/months';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import Spinner from '@/components/Spinner';
import { IMonth } from '@/types/models';
import ErrorMessage from '@/components/ErrorMessage';
import InputText from './InputText';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  createdAt: z.date(),
  weekLimitAmount: z
    .string()
    .transform((val) => Number(val))
    .optional(),
});
// get type from schema
type FormData = z.infer<typeof schema>;

function ModalCreateNewMonth({ setIsModalOpen }: Props) {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, updateUserMonthsOnMonthCreation } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const date = new Date();
  const inputMaxMonth = `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}`;

  const isValidMonth = (month: Date) => {
    if (userMonths.length > 0) {
      const foundMonth = userMonths.find((oneMonth) =>
        isSameMonth(new Date(month), oneMonth.createdAt),
      );
      if (foundMonth) return false;
    }
    return true;
  };

  const handleCreateMonth = async ({
    createdAt,
    weekLimitAmount,
  }: FormData) => {
    if (!user) return;
    setErrorMessage('');

    const requestBody = weekLimitAmount
      ? {
          createdAt,
          weekLimitAmount,
          userId: user._id,
        }
      : {
          createdAt,
          userId: user._id,
        };

    try {
      setIsLoading(true);
      const createdMonth: IMonth = await createMonth(requestBody);
      updateUserMonthsOnMonthCreation(createdMonth);
      setIsModalOpen(false);
    } catch (error: any) {
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 z-10 w-screen h-screen '>
      <div
        className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs
        bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'
      >
        <p className='text-gray-300 uppercase font-semibold'>Add Month</p>

        <form onSubmit={handleSubmit(handleCreateMonth)} className='w-full'>
          <div className='mb-4 mt-2'>
            <label className='text-lg capitalize' htmlFor='createdAt'>
              <p className='text-gray-300 text-sm mb-1'>Select month*</p>
              {/* div to fix safari not applying w-full to input */}
              <div className='w-[284px] mb-1'>
                <input
                  type={APP.inputName.month}
                  {...register('createdAt', {
                    required: 'Month is required',
                    validate: isValidMonth,
                  })}
                  className='w-[284px] h-12 rounded-md px-2 border border-transparent
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
                  max={inputMaxMonth}
                />
              </div>

              {errors.createdAt?.message && (
                <ErrorMessage>{errors.createdAt.message}</ErrorMessage>
              )}
              {errors.createdAt?.type === 'validate' && (
                <ErrorMessage>Selected month already exist</ErrorMessage>
              )}
            </label>

            <div className='my-2'>
              <InputText
                register={register}
                errors={errors}
                inputName='weekLimitAmount'
                inputRules={APP.formRules.weekLimitAmount}
              />

              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </div>
          </div>

          <div className='flex justify-center'>
            {isLoading ? <Spinner size={80} /> : <Button> Add </Button>}
          </div>
        </form>
      </div>

      <div
        className='bg-black/50 w-full h-full absolute z-20'
        role='button'
        onClick={() => setIsModalOpen(false)}
        onKeyDown={() => setIsModalOpen(false)}
        aria-label='Close modal'
        tabIndex={0}
      />
    </div>
  );
}

export default ModalCreateNewMonth;

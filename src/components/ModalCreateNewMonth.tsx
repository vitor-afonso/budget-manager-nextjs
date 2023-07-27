'use client';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isSameMonth } from 'date-fns';
import { z } from 'zod';
import { APP } from '@/utils/app.constants';
import Button from '@/components/Button';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { createMonth } from '@/services/months';
import { IUserDataContext, UserDataContext } from '@/app/context/userData.context';
import Spinner from '@/components/Spinner';
import { IMonth } from '@/types/models';
import ErrorMessage from '@/components/ErrorMessage';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  createdAt: z.date(),
});
//get type from schema
type FormData = z.infer<typeof schema>;

const ModalCreateNewMonth = ({ setIsModalOpen }: Props) => {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, updateUserMonthsOnMonthCreation } = useContext(UserDataContext) as IUserDataContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const date = new Date();
  const inputMaxMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');

  const isValidMonth = (month: Date) => {
    if (userMonths.length > 0) {
      let foundMonth = userMonths.find((oneMonth) => isSameMonth(new Date(month), oneMonth.createdAt));
      if (foundMonth) return false;
    }
    return true;
  };

  const handleCreateMonth = async ({ createdAt }: FormData) => {
    if (!user) return;
    setErrorMessage('');

    try {
      setIsLoading(true);
      const requestBody = {
        createdAt,
        userId: user._id,
      };
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
    <div className='absolute top-0 left-0 z-10 w-screen h-screen '>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='text-gray-300 uppercase font-semibold'>Add Month</p>

        <form onSubmit={handleSubmit(handleCreateMonth)} className='w-full'>
          <div className='mb-4 mt-2'>
            <label className='text-lg capitalize'>
              <p className='text-gray-300 text-sm'>Select month</p>
              {/* div to fix safari not applying w-full to input */}
              <div className='w-[284px] mb-1'>
                <input
                  type={APP.inputName.month}
                  {...register('createdAt', {
                    required: 'Month is required',
                    validate: isValidMonth,
                  })}
                  className='w-[284px] h-12 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
                  max={inputMaxMonth}
                />
              </div>
            </label>
            {errors.createdAt?.message && <ErrorMessage>{errors.createdAt.message}</ErrorMessage>}
            {errors.createdAt?.type === 'validate' && <ErrorMessage>Selected month already exist</ErrorMessage>}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </div>

          {isLoading ? <Spinner /> : <Button>Add</Button>}
        </form>
      </div>

      <div className='bg-black/50 w-full h-full absolute z-20' onClick={() => setIsModalOpen(false)}></div>
    </div>
  );
};

export default ModalCreateNewMonth;

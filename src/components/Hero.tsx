'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import { createMonth } from '@/services/months';
import { IUserDataContext, UserDataContext } from '@/app/context/userData.context';

const Hero = () => {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, updateUserMonthsOnMonthCreation } = useContext(UserDataContext) as IUserDataContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const isCurrentMonthOpen = () => {
    if (userMonths.length > 0) {
      let month = userMonths.find((oneMonth) => isSameMonth(new Date(), oneMonth.createdAt));
      if (month) return true;
    }
    return false;
  };

  const handleCreateMonth = async () => {
    if (!user) {
      router.push(APP.pageRoutes.login);
      return;
    }
    if (isCurrentMonthOpen()) return;
    setIsLoading(true);
    try {
      const createdMonth = await createMonth(user._id);
      updateUserMonthsOnMonthCreation(createdMonth);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full md:w-80'>
      {!user && <div className='w-full md:w-80 h-80 bg-slate-400 mb-4'></div>}
      {!isCurrentMonthOpen() && (
        <button className='border border-black text-xl rounded-3xl h-10 bg-slate-200 w-full hover:text-gray-200 hover:bg-slate-400 duration-300' onClick={handleCreateMonth}>
          Open new Month
        </button>
      )}
    </section>
  );
};

export default Hero;

'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { APP } from '@/utils/app.constants';
import { createMonth } from '@/services/months';
import Button from '@/components/Button';

const Hero = () => {
  const { user, userMonths, updateUserMonthsOnMonthCreation } = useContext(AuthContext) as IAppContext;
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
      {!isCurrentMonthOpen() && <Button innerText={APP.buttonAction.newMonth} clickHandler={handleCreateMonth} />}
    </section>
  );
};

export default Hero;

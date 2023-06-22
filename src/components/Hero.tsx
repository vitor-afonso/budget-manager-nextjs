'use client';

import { useContext, useState } from 'react';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';
import ModalCreateMonth from './ModalCreateMonth';
import { useRouter } from 'next/navigation';
import { APP } from '@/utils/app.constants';

const Hero = () => {
  const { user, userMonths } = useContext(AuthContext) as IAppContext;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const isCurrentMonthOpen = () => {
    if (userMonths.length > 0) {
      let month = userMonths.find((oneMonth) => isSameMonth(new Date(), oneMonth.createdAt));
      if (month) return true;
    }
    return false;
  };

  const handleOpenNewMonth = () => {
    if (!user) {
      router.push(APP.pageRoutes.login);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <section className='w-full md:w-80'>
      {!user && <div className='w-full md:w-80 h-80 bg-slate-400 mb-4'></div>}
      {!isCurrentMonthOpen() && !isModalOpen && (
        <button className='border border-black text-xl rounded-3xl h-10 bg-slate-200 w-full hover:text-gray-200 hover:bg-slate-400 duration-300' onClick={handleOpenNewMonth}>
          Open new Month
        </button>
      )}
      {isModalOpen && <ModalCreateMonth isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </section>
  );
};

export default Hero;

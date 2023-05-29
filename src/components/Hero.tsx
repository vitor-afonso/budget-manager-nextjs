'use client';

import { useContext } from 'react';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/auth.context';

const Hero = () => {
  const { user, userMonths } = useContext(AuthContext) as IAppContext;

  const isCurrentMonthOpen = () => {
    if (userMonths.length > 0) {
      let month = userMonths.find((oneMonth) => isSameMonth(new Date(), oneMonth.createdAt));
      if (month) return true;
    }
    return false;
  };

  return (
    <section className='w-full md:w-80'>
      {!user && <div className='w-full md:w-80 h-80 bg-slate-400 mb-4'></div>}
      {!isCurrentMonthOpen() && <button className='border border-black text-xl rounded-3xl h-10 bg-slate-100 w-full'>Open new Month</button>}
    </section>
  );
};

export default Hero;

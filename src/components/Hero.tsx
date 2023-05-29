'use client';

import { AuthContext, IAppContext } from '@/app/auth.context';
import { useContext } from 'react';

const Hero = () => {
  const { user, userMonths } = useContext(AuthContext) as IAppContext;

  const isCurrentMonthOpen = () => {
    let today = new Date();
    let currentMonth = today.getUTCMonth();
    let currentYear = today.getFullYear();
    let monthAlreadyExist = false;
    if (userMonths.length > 0) {
      userMonths.forEach((month) => {
        if (month.createdAt.getUTCMonth() === currentMonth && month.createdAt.getFullYear() === currentYear) {
          monthAlreadyExist = true;
          return;
        }
      });
    }
    return monthAlreadyExist;
  };
  return (
    <section className='w-full md:w-80'>
      {!user && <div className='w-full md:w-80 h-80 bg-slate-400 mb-4'></div>}
      {!isCurrentMonthOpen() && <button className='border border-black text-xl rounded-3xl h-10 bg-slate-100 w-full'>Open new Month</button>}
    </section>
  );
};

export default Hero;

'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import Button from '@/components/Button';

const Hero = () => {
  const { user } = useContext(AuthContext) as IAppContext;
  const router = useRouter();

  return (
    <section className='w-full md:w-80'>
      {!user && (
        <>
          <div className='w-full md:w-80 h-80 bg-slate-400 mb-4'></div>
          <Button clickHandler={() => router.push(APP.pageRoutes.login)}>{APP.buttonAction.seeMonths}</Button>
        </>
      )}
    </section>
  );
};

export default Hero;

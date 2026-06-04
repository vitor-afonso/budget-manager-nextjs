'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isSameMonth } from 'date-fns';
import { useTranslations } from 'next-intl';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import Button from '@/components/Button';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import ModalCreateNewMonth from './ModalCreateNewMonth';

function Hero() {
  const [isCurrentMonthOpen, setIsCurrentMonthOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { userMonths, isLoadingUserDataContext } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const { user, isLoadingContext } = useContext(AuthContext) as IAppContext;
  const router = useRouter();
  const tHero = useTranslations('hero');
  const tNav = useTranslations('nav');

  const userIsLoggedInAndCurrentMonthIsNotOpen = user && !isCurrentMonthOpen;

  useEffect(() => {
    if (userMonths.length > 0) {
      const month = userMonths.find((oneMonth) =>
        isSameMonth(new Date(), oneMonth.createdAt),
      );
      if (month) {
        setIsCurrentMonthOpen(true);
      }
    }
  }, [userMonths]);

  return (
    <section className='w-full md:w-80'>
      {!isLoadingContext &&
        (!user ||
          (user && userMonths.length < 1 && !isLoadingUserDataContext)) && (
        <>
          {(!user || userIsLoggedInAndCurrentMonthIsNotOpen) && (
            <div className='w-full md:w-80 h-80 mb-4'>
              <Image
                src={APP.images.logo}
                width={320}
                height={320}
                alt={tHero('logoAlt')}
                priority
              />
            </div>
          )}

          {userIsLoggedInAndCurrentMonthIsNotOpen && (
            <Button clickHandler={() => setIsModalOpen(true)}>
              {tHero('openMonth')}
            </Button>
          )}

          {!user && (
            <Button clickHandler={() => router.push(APP.pageRoutes.login)}>
              {tNav('login')}
            </Button>
          )}
          {isModalOpen && (
            <ModalCreateNewMonth setIsModalOpen={setIsModalOpen} />
          )}
        </>
      )}
    </section>
  );
}

export default Hero;

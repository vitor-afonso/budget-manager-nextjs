'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import Button from '@/components/Button';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import ModalCreateNewMonth from './ModalCreateNewMonth';

const Hero = () => {
  const [isCurrentMonthOpen, setIsCurrentMonthOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { userMonths } = useContext(UserDataContext) as IUserDataContext;
  const { user } = useContext(AuthContext) as IAppContext;
  const router = useRouter();

  let userIsLoggedInAndCurrentMonthIsNotOpen = user && !isCurrentMonthOpen;

  //check if current month is open
  useEffect(() => {
    if (userMonths.length > 0) {
      let month = userMonths.find((oneMonth) =>
        isSameMonth(new Date(), oneMonth.createdAt),
      );
      if (month) {
        setIsCurrentMonthOpen(true);
      }
    }
  }, [userMonths]);

  return (
    <section className="w-full md:w-80">
      {(!user || (user && userMonths.length < 1)) && (
        <>
          {(!user || userIsLoggedInAndCurrentMonthIsNotOpen) && (
            <div className="w-full md:w-80 h-80 mb-4">
              <Image
                src={APP.images.logo}
                width={320}
                height={320}
                alt="Colorful machine managing the money"
                priority
              />
            </div>
          )}

          {userIsLoggedInAndCurrentMonthIsNotOpen && (
            <Button clickHandler={() => setIsModalOpen(true)}>
              {APP.buttonAction.openMonth}
            </Button>
          )}

          {!user && (
            <Button clickHandler={() => router.push(APP.pageRoutes.login)}>
              {APP.buttonAction.login}
            </Button>
          )}
          {isModalOpen && (
            <ModalCreateNewMonth setIsModalOpen={setIsModalOpen} />
          )}
        </>
      )}
    </section>
  );
};

export default Hero;

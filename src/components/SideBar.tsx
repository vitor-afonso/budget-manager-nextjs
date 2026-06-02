'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import ModalCreateNewMonth from '@/components/ModalCreateNewMonth';
import { useLocale } from '@/app/providers/LocaleProvider';
import { type Locale } from '@/i18n/config';

function SideBar() {
  const { user, logOutUser } = useContext(AuthContext) as IAppContext;
  const { resetAppStates, userMonths } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations('nav');
  const { locale, setLocale } = useLocale();

  function handleLogout() {
    logOutUser();
    resetAppStates();
    setIsDrawerOpen(false);
    router.push(APP.pageRoutes.home);
  }

  function handleLocaleChange(newLocale: Locale) {
    setLocale(newLocale);
    setIsDrawerOpen(false);
  }

  return (
    <div>
      <div className='text-slate-200 mb-2 flex justify-between w-full '>
        <button
          type='button'
          className='cursor-pointer hover:text-slate-400 duration-300'
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='3.75 9 16.5 6.75'
            strokeWidth='3'
            stroke='currentColor'
            className='w-10 h-8 '
            style={{ padding: 0 }}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 9h16.5m-16.5 6.75h16.5'
            />
          </svg>
        </button>
        {user && userMonths.length > 0 && (
          <button
            type='button'
            className='cursor-pointer hover:text-slate-400 duration-300'
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='3'
              stroke='currentColor'
              className='w-8 h-8 text-slate-200'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4.5v15m7.5-7.5h-15'
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={clsx(
          !isDrawerOpen && 'hidden',
          'left-0 fixed top-0 bottom-0 w-full flex z-[60]',
        )}
      >
        <div className='p-2 w-[50%] md:w-[25%] overflow-y-auto bg-slate-700 '>
          <div className='text-gray-100 text-sm'>
            <div className='flex items-center justify-center'>
              <h1 className='font-bold text-gray-200'>{t('slogan')}</h1>
            </div>
            <div className='my-2 bg-gray-600 h-[1px]' />
          </div>

          <Link
            href={APP.pageRoutes.home}
            className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500'
            onClick={() => setIsDrawerOpen(false)}
          >
            <span className='text-4 text-gray-200 font-bold capitalize'>
              {user ? t('currentMonth') : t('home')}
            </span>
          </Link>
          {user && (
            <>
              <Link
                href={APP.pageRoutes.month}
                className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500'
                onClick={() => setIsDrawerOpen(false)}
              >
                <span className='text-4 text-gray-200 font-bold capitalize'>
                  {t('monthDetails')}
                </span>
              </Link>
              <Link
                href={APP.pageRoutes.year}
                className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500'
                onClick={() => setIsDrawerOpen(false)}
              >
                <span className='text-4 text-gray-200 font-bold capitalize'>
                  {t('yearDetails')}
                </span>
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link
                href={APP.pageRoutes.login}
                className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500'
                onClick={() => setIsDrawerOpen(false)}
              >
                <span className='text-4 text-gray-200 font-bold'>
                  {t('login')}
                </span>
              </Link>
              <Link
                href={APP.pageRoutes.signup}
                className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500'
                onClick={() => setIsDrawerOpen(false)}
              >
                <span className='text-4 text-gray-200 font-bold'>
                  {t('signup')}
                </span>
              </Link>
            </>
          )}

          {user && (
            <button
              type='button'
              className='py-2 px-4 mt-3 flex items-center rounded-md duration-300 hover:bg-slate-400 w-full'
              onClick={handleLogout}
            >
              <span className='text-4 text-gray-200 font-bold'>
                {t('logout')}
              </span>
            </button>
          )}

          <div className='my-2 bg-gray-600 h-[1px]' />
          <div className='py-2 px-4 flex items-center gap-2'>
            <span className='text-xs text-gray-400'>
              {t('languageSelector')}:
            </span>
            <button
              type='button'
              onClick={() => handleLocaleChange('pt-PT')}
              className={clsx(
                'text-xs px-2 py-1 rounded-md duration-300',
                locale === 'pt-PT'
                  ? 'bg-slate-500 text-gray-100 font-bold'
                  : 'text-gray-400 hover:text-gray-200',
              )}
            >
              PT
            </button>
            <button
              type='button'
              onClick={() => handleLocaleChange('en')}
              className={clsx(
                'text-xs px-2 py-1 rounded-md duration-300',
                locale === 'en'
                  ? 'bg-slate-500 text-gray-100 font-bold'
                  : 'text-gray-400 hover:text-gray-200',
              )}
            >
              EN
            </button>
          </div>
        </div>
        <div
          role='button'
          className='bg-black/50 w-[50%] md:w-[75%] h-full'
          onClick={() => setIsDrawerOpen(false)}
          onKeyDown={() => setIsDrawerOpen(false)}
          aria-label={t('closeMenu')}
          tabIndex={0}
        />
      </div>
      {isModalOpen && <ModalCreateNewMonth setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default SideBar;

'use client';
import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { APP } from '@/utils/app.constants';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';
import ModalCreateNewMonth from '@/components/ModalCreateNewMonth';

const SideBar = () => {
  const { user, logOutUser } = useContext(AuthContext) as IAppContext;
  const { resetAppStates, userMonths } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  function toggleSideBar() {
    setIsDrawerOpen(!isDrawerOpen);
  }

  function handleLogout() {
    logOutUser();
    resetAppStates();
    setIsDrawerOpen(!isDrawerOpen);
    router.push(APP.pageRoutes.home);
  }

  return (
    <div>
      <div className="text-slate-200 mb-2 flex justify-between w-full ">
        <button
          className="cursor-pointer hover:text-slate-400 duration-300"
          onClick={toggleSideBar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="3.75 9 16.5 6.75"
            strokeWidth="3"
            stroke="currentColor"
            className="w-10 h-8 "
            style={{ padding: 0 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </button>
        {user && userMonths.length > 0 && (
          <button
            className="cursor-pointer hover:text-slate-400 duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-8 h-8 text-slate-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        )}
      </div>
      <div
        className={clsx(
          !isDrawerOpen && 'hidden',
          'left-0 fixed top-0 bottom-0 w-full flex',
        )}
      >
        <div className={`p-2 w-[50%] md:w-[25%] overflow-y-auto bg-slate-700 `}>
          <div className="text-gray-100 text-sm">
            <div className="flex items-center justify-center">
              <h1 className="font-bold text-gray-200">
                Money doesn&apos;t sleep
              </h1>
            </div>
            <div className="my-2 bg-gray-600 h-[1px]"></div>
          </div>

          <Link
            href={APP.pageRoutes.home}
            className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500"
            onClick={toggleSideBar}
          >
            <span className="text-4 text-gray-200 font-bold capitalize">
              {user ? 'Current Month' : 'Home'}
            </span>
          </Link>
          {user && (
            <>
              <Link
                href={APP.pageRoutes.month}
                className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500"
                onClick={toggleSideBar}
              >
                <span className="text-4 text-gray-200 font-bold capitalize">
                  Month details
                </span>
              </Link>
              <Link
                href={APP.pageRoutes.year}
                className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500"
                onClick={toggleSideBar}
              >
                <span className="text-4 text-gray-200 font-bold capitalize">
                  Year details
                </span>
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link
                href={APP.pageRoutes.login}
                className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500"
                onClick={toggleSideBar}
              >
                <span className="text-4 text-gray-200 font-bold">Login</span>
              </Link>
              <Link
                href={APP.pageRoutes.signup}
                className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 cursor-pointer hover:bg-slate-500"
                onClick={toggleSideBar}
              >
                <span className="text-4 text-gray-200 font-bold">Signup</span>
              </Link>
            </>
          )}

          {user && (
            <button
              className="py-2 px-4 mt-3 flex items-center rounded-md duration-300 hover:bg-slate-400 w-full"
              onClick={handleLogout}
            >
              <span className="text-4 text-gray-200 font-bold">Logout</span>
            </button>
          )}
        </div>
        <div
          className="bg-black/50 w-[50%] md:w-[75%] h-full"
          onClick={toggleSideBar}
        ></div>
      </div>
      {isModalOpen && <ModalCreateNewMonth setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default SideBar;

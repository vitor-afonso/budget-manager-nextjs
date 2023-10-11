import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  clickHandler?(): void;
}

const Button = ({ children, clickHandler }: Props) => {
  return (
    <button
      className="!mt-0 w-full flex justify-center items-center text-lg py-2 px-4 border border-transparent rounded-3xl shadow-sm text-md font-medium text-gray-200 hover:text-slate-700 bg-slate-400 hover:bg-slate-300 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-slate-500 h-16 duration-200 capitalize"
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

interface Props {
  children: string | string[];
  clickHandler?(): void;
}

const Button = ({ children, clickHandler }: Props) => {
  return (
    <button
      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-md font-medium text-gray-300 hover:text-slate-700 bg-slate-500 hover:bg-slate-300 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-slate-500 h-10 duration-200 capitalize'
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;

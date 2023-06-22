import React from 'react';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalCreateMonth = ({ isModalOpen, setIsModalOpen }: Props) => {
  const handleCreateMonth = () => {
    setIsModalOpen(false);
    // call createMonth(some data)
    // upddate userMonths
  };
  return (
    <div className='absolute top-0 left-0 z-10 w-screen h-screen '>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='text-gray-200'>Custom Modal</p>
        {/* CREATE FORM */}
      </div>
      <div className='bg-black/50 w-full h-full absolute z-20' onClick={() => setIsModalOpen(false)}></div>
    </div>
  );
};

export default ModalCreateMonth;

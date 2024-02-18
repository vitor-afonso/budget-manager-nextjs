import React from 'react';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainFunction(): void;
  question: string;
  buttonText: string;
}

function ModalCustom({
  setIsModalOpen,
  mainFunction,
  question,
  buttonText,
}: Props) {
  const runMainFunction = () => {
    mainFunction();
    setIsModalOpen(false);
  };
  return (
    <div className='fixed top-0 left-0 z-10 w-screen h-screen'>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='capitalize text-gray-200'>
          {buttonText} <span className='font-semibold'>{question}</span>?
        </p>
        <div className='flex'>
          <button
            type='button'
            onClick={() => setIsModalOpen(false)}
            className='mr-2 text-slate-800'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={runMainFunction}
            className='text-red-500'
          >
            {buttonText}
          </button>
        </div>
      </div>

      <div
        role='button'
        className='bg-black/50 w-full h-full absolute z-20'
        onClick={() => setIsModalOpen(false)}
        onKeyDown={() => setIsModalOpen(false)}
        aria-label='Close modal'
        tabIndex={0}
      />
    </div>
  );
}

export default ModalCustom;

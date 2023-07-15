import React from 'react';

interface Props {
  register(name: string, {}): any;
  errors: any;
  inputName: string;
  inputType?: string;
}

const InputText = ({ register, errors, inputName, inputType }: Props) => {
  return (
    <div>
      <label>
        <p className='text-gray-300 text-lg capitalize'>{inputName}</p>
        <input
          type={inputType}
          {...register(inputName, { required: `${inputName} is required` })}
          className='mt-1 w-full h-8 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
        />
      </label>
      {errors.inputName?.message && <p className='text-red-500 font-bold text-sm'>{errors.inputName.message}</p>}
    </div>
  );
};

export default InputText;

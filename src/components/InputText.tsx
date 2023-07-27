import React from 'react';

interface Props {
  register: any;
  errors: any;
  inputName: string;
  inputType?: string;
  inputRules: any;
}

const InputText = ({ register, errors, inputName, inputType, inputRules }: Props) => {
  return (
    <div>
      <label className='text-gray-300 text-lg capitalize'>
        <p className='text-sm'>{inputName}</p>
        <input
          type={inputType}
          {...register(inputName, inputRules)}
          className='mt-1 w-full h-12 text-gray-800 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
        />
      </label>
      {errors[`${inputName}`]?.message && <p className='text-red-500 font-bold text-sm'>{errors[`${inputName}`].message}</p>}
    </div>
  );
};

export default InputText;

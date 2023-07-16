import { APP } from '@/utils/app.constants';
import { getMinMaxDate } from '@/utils/app.methods';
import React from 'react';

interface Props {
  register: any;
  errors: any;
  inputName: string;
  monthDate: Date;
}

const InputDate = ({ register, errors, inputName, monthDate }: Props) => {
  return (
    <div>
      <label className='text-gray-300 text-lg capitalize'>
        Date
        <input
          type={APP.inputName.date}
          {...register(inputName, {
            required: 'Date is required',
          })}
          className='mt-1 w-full h-12 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
          min={getMinMaxDate(monthDate, 'min')}
          max={getMinMaxDate(monthDate, 'max')}
        />
      </label>
      {errors[`${inputName}`]?.message && <p className='text-red-500 font-bold text-sm'>{errors[`${inputName}`].message}</p>}
    </div>
  );
};

export default InputDate;
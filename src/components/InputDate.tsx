/* eslint-disable react/jsx-props-no-spreading */
import { APP } from '@/utils/app.constants';
import { getMinMaxDate } from '@/utils/app.methods';
import ErrorMessage from '@/components/ErrorMessage';

interface Props {
  register: any;
  errors: any;
  inputName: string;
  monthDate: Date;
}

function InputDate({
  register, errors, inputName, monthDate,
}: Props) {
  return (
    <div>
      <label className='text-lg capitalize' htmlFor={inputName}>
        <p className='text-sm text-gray-300'>Date</p>
        {/* div to fix safari not applying w-full to input */}
        <div className='w-[284px]'>
          <input
            type={APP.inputName.date}
            {...register(inputName, {
              required: 'Date is required',
            })}
            className='w-[284px] h-12 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
            min={getMinMaxDate(monthDate, 'min')}
            max={getMinMaxDate(monthDate, 'max')}
          />
        </div>
      </label>
      {errors[`${inputName}`]?.message && (
        <ErrorMessage>{errors[`${inputName}`].message}</ErrorMessage>
      )}
    </div>
  );
}

export default InputDate;

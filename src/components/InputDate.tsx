/* eslint-disable react/jsx-props-no-spreading */

'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { APP } from '@/utils/app.constants';
import { getMinMaxDate } from '@/utils/app.methods';
import ErrorMessage from '@/components/ErrorMessage';

interface Props {
  register: any;
  errors: any;
  inputName: string;
  monthDate: Date;
  disabled?: boolean;
}

function InputDate({ register, errors, inputName, monthDate, disabled }: Props) {
  const t = useTranslations('forms.labels');
  const tValidation = useTranslations('forms.validation');

  return (
    <div>
      <label className='text-lg capitalize' htmlFor={inputName}>
        <p className='text-sm text-gray-300'>{t('date')}</p>
        {/* div to fix safari not applying w-full to input */}
        <div className='w-[284px]'>
          <input
            type={APP.inputName.date}
            {...register(inputName, {
              required: tValidation('dateRequired'),
            })}
            disabled={disabled}
            className={clsx(
              'w-[284px] h-12 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
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

/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import ErrorMessage from '@/components/ErrorMessage';

interface Props {
  register: any;
  errors: any;
  inputName: string;
  inputType?: string;
  inputRules: any;
  suggestions?: string[];
}

function InputText({
  register,
  errors,
  inputName,
  inputType,
  inputRules,
  suggestions,
}: Props) {
  const listId = suggestions?.length ? `${inputName}-list` : undefined;

  return (
    <div>
      <label className='text-gray-300 text-lg capitalize' htmlFor={inputName}>
        <p className='text-sm'>{inputName}</p>
        <div className='relative mt-1'>
          <input
            type={inputType}
            list={listId}
            {...register(inputName, inputRules)}
            className={clsx(
              'w-full h-12 text-gray-800 rounded-md px-2 border border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400',
              listId && 'datalist-input pr-8',
            )}
          />
          {listId && (
            <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='h-4 w-4'
                aria-hidden='true'
              >
                <path
                  fillRule='evenodd'
                  d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          )}
        </div>
      </label>
      {listId && (
        <>
          <datalist id={listId}>
            {suggestions!.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </datalist>
          <p className='text-xs text-gray-300 mt-1'>
            Select from the list or type a new one
          </p>
        </>
      )}
      {errors[`${inputName}`]?.message && (
        <ErrorMessage>{errors[`${inputName}`].message}</ErrorMessage>
      )}
    </div>
  );
}

export default InputText;

/* eslint-disable react/jsx-props-no-spreading */
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
        <input
          type={inputType}
          list={listId}
          {...register(inputName, inputRules)}
          className='mt-1 w-full h-12 text-gray-800 rounded-md px-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
        />
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

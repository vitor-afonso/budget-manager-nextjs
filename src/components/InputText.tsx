/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useMemo, useRef, useState } from 'react';
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

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
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
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    ref: registerRef,
    onChange: registerOnChange,
    onFocus: registerOnFocus,
    ...registerProps
  } = register(inputName, inputRules);

  const filteredSuggestions = useMemo(() => {
    if (!suggestions?.length) return [];

    const normalized = query.trim().toLowerCase();
    if (!normalized) return suggestions;

    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(normalized),
    );
  }, [suggestions, query]);

  const showSuggestions = isSuggestionsOpen && filteredSuggestions.length > 0;

  useEffect(() => {
    if (!isSuggestionsOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isSuggestionsOpen]);

  const syncQueryFromInput = () => {
    setQuery(inputRef.current?.value ?? '');
  };

  const selectSuggestion = (value: string) => {
    const input = inputRef.current;
    if (!input) return;

    setNativeInputValue(input, value);
    setQuery(value);
    input.focus();
    setIsSuggestionsOpen(false);
  };

  return (
    <div>
      <label className='text-gray-300 text-lg capitalize' htmlFor={inputName}>
        <p className='text-sm'>{inputName}</p>
        <div className='relative mt-1' ref={wrapperRef}>
          <input
            type={inputType}
            {...registerProps}
            onChange={(event) => {
              registerOnChange(event);
              setQuery(event.target.value);
              setIsSuggestionsOpen(true);
            }}
            onFocus={(event) => {
              registerOnFocus?.(event);
              syncQueryFromInput();
              setIsSuggestionsOpen(true);
            }}
            ref={(element) => {
              registerRef(element);
              inputRef.current = element;
            }}
            className={clsx(
              'w-full h-12 text-gray-800 rounded-md px-2 border border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400',
              listId && 'pr-10',
            )}
          />
          {listId && (
            <>
              <button
                type='button'
                tabIndex={-1}
                aria-label='Show category suggestions'
                aria-expanded={isSuggestionsOpen}
                className='absolute right-0 top-0 flex h-12 w-10 items-center justify-center text-gray-500'
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  syncQueryFromInput();
                  setIsSuggestionsOpen((prev) => !prev);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='pointer-events-none h-4 w-4'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              {showSuggestions && (
                <ul className='absolute left-0 right-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-300 bg-slate-100 shadow-lg'>
                  {filteredSuggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type='button'
                        className='w-full px-3 py-2 text-left capitalize text-gray-800 hover:bg-slate-200'
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </label>
      {listId && (
        <p className='text-xs text-gray-300 mt-1'>
          Select from the list or type a new one
        </p>
      )}
      {errors[`${inputName}`]?.message && (
        <ErrorMessage>{errors[`${inputName}`].message}</ErrorMessage>
      )}
    </div>
  );
}

export default InputText;

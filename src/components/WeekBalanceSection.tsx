'use client';

import clsx from 'clsx';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getCurrencyFormatter } from '@/utils/app.constants';
import { useLocale } from '@/app/providers/LocaleProvider';

interface Props {
  weekBalance: number | null;
  weekLimit: number | null;
  spentThisWeek: number | null;
  categories: string[];
  isExcluded: (name: string) => boolean;
  onToggleCategory: (name: string) => void;
}

function WeekBalanceSection({
  weekBalance,
  weekLimit,
  spentThisWeek,
  categories,
  isExcluded,
  onToggleCategory,
}: Props) {
  const t = useTranslations('charts');
  const tEvents = useTranslations('events');
  const { locale } = useLocale();
  const currency = getCurrencyFormatter(locale);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const excludedList = categories.filter(isExcluded);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories.filter(
      (c) => !isExcluded(c) && c.toLowerCase().includes(normalized),
    );
  }, [categories, query, isExcluded]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSelect = (category: string) => {
    onToggleCategory(category);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className='flex flex-col p-4 mt-4 items-center border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300 gap-3'>
      <div className='flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100'>
        <div className='flex flex-col text-center text-md font-semibold'>
          <h2>{t('weekBalance')}</h2>
          <span
            className={clsx(
              weekBalance! >= 0 ? 'text-green-500' : 'text-red-500',
            )}
          >
            {currency.format(weekBalance!)}
          </span>
        </div>
      </div>

      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32 items-center justify-center bg-slate-100'>
          <h6 className='font-medium capitalize'>{tEvents('weekLimit')}</h6>
          <span className='text-green-500'>{currency.format(weekLimit!)}</span>
        </div>
        <div className='flex flex-col border border-black text-xs rounded-3xl h-10 w-32 items-center justify-center bg-slate-100'>
          <h6 className='font-medium capitalize'>{tEvents('weekSpent')}</h6>
          <span className='text-red-500'>
            {currency.format(spentThisWeek!)}
          </span>
        </div>
      </div>

      {categories.length > 0 && (
        <div className='w-full'>
          <p className='text-xs font-medium mb-2 text-center capitalize'>
            {t('weekExcludeCategories')}
          </p>

          <div className='relative' ref={wrapperRef}>
            <div className='relative'>
              <input
                type='text'
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={t('weekExcludePlaceholder')}
                className='w-full h-9 text-sm text-gray-800 rounded-3xl px-3 pr-9 border border-black bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400'
              />
              <button
                type='button'
                tabIndex={-1}
                aria-label={t('weekExcludeCategories')}
                aria-expanded={isOpen}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setIsOpen((prev) => !prev)}
                className='absolute right-0 top-0 flex h-9 w-9 items-center justify-center text-gray-500'
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
            </div>

            {isOpen && suggestions.length > 0 && (
              <ul className='absolute left-0 right-0 top-full z-50 mt-1 max-h-36 overflow-y-auto rounded-xl border border-black bg-slate-100 shadow-lg'>
                {suggestions.map((category) => (
                  <li key={category}>
                    <button
                      type='button'
                      className='w-full px-3 py-2 text-left text-sm capitalize text-gray-800 hover:bg-slate-200'
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {excludedList.length > 0 && (
            <ul className='flex flex-col gap-1 mt-2 max-h-28 overflow-y-auto'>
              {excludedList.map((category) => (
                <li
                  key={category}
                  className='flex items-center justify-between bg-slate-500 text-white text-xs rounded-3xl px-3 py-1'
                >
                  <span className='capitalize line-through'>{category}</span>
                  <button
                    type='button'
                    aria-label={`remove ${category}`}
                    onClick={() => onToggleCategory(category)}
                    className='ml-2 flex items-center justify-center w-4 h-4 rounded-full hover:bg-slate-400'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                      className='w-3 h-3'
                      aria-hidden='true'
                    >
                      <path d='M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z' />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default WeekBalanceSection;

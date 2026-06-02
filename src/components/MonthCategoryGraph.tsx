'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartOptions,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslations } from 'next-intl';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import {
  getCategoryNamestoShow,
  getCategoryTotals,
  getGraphColors,
} from '@/utils/app.methods';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options: ChartOptions<'pie'> = {
  plugins: {
    legend: {
      display: true,
      labels: { color: '#f3f4f6' },
      position: 'top',
    },
  },
};

function MonthCategoriesGraph({
  incomeExpenseList,
  categoryType,
}: {
  incomeExpenseList: IIncome[] | IExpense[];
  categoryType: string;
}): JSX.Element {
  const t = useTranslations('charts');
  const isIncome = categoryType === APP.eventType.income;
  const { categoryTotals } = getCategoryTotals(incomeExpenseList);

  const data = {
    labels: getCategoryNamestoShow(
      incomeExpenseList,
      Object.fromEntries(categoryTotals),
    ),
    datasets: [
      {
        label: t('totalEur'),
        data: Array.from(categoryTotals.values()),
        backgroundColor: getGraphColors(categoryType),
        borderColor: '#000',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='flex flex-col items-center text-gray-100 mb-4'>
      <h1 className='text-xl font-semibold my-4 capitalize'>
        {isIncome ? t('incomesByCategory') : t('expensesByCategory')}
      </h1>
      {incomeExpenseList.length > 0 && <Pie data={data} options={options} />}
      {incomeExpenseList.length === 0 && (
        <p className='text-gray-400'>
          {isIncome ? t('noIncomeData') : t('noExpenseData')}
        </p>
      )}
    </div>
  );
}

export default MonthCategoriesGraph;

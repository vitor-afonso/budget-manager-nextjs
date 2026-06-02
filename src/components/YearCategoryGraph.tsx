'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslations } from 'next-intl';
import { IYear } from '@/types/models';
import useGetYearGraphData from '@/app/hooks/useGetYearGraphData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
ChartJS.defaults.color = '#F3F4F6';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: '2023',
    },
  },
};

interface Props {
  currentYear: IYear;
  allOpenMonths: Date[];
}

function YearCategoriesGraph({
  currentYear,
  allOpenMonths,
}: Props): JSX.Element {
  const t = useTranslations('events');
  const { incomeBarData, expenseBarData, monthNames } = useGetYearGraphData(
    currentYear,
    allOpenMonths,
  );

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: t('incomes'),
        data: incomeBarData,
        backgroundColor: '#21C55D',
      },
      {
        label: t('expenses'),
        data: expenseBarData,
        backgroundColor: '#EF4444',
      },
    ],
  };
  return (
    <div className='flex flex-col items-center text-gray-100 my-4'>
      <Bar options={options} data={data} />
    </div>
  );
}

export default YearCategoriesGraph;

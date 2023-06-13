import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IYear } from '@/types/models';
import { getYearIncomesExpensesBarData } from '@/utils/app.methods';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
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

const YearCategoriesGraph = ({ currentYear }: { currentYear: IYear }): JSX.Element => {
  const incomes = getYearIncomesExpensesBarData(currentYear.incomes);
  const expenses = getYearIncomesExpensesBarData(currentYear.expenses);

  const data = {
    labels: Object.keys(incomes),
    datasets: [
      {
        label: 'Incomes',
        data: Object.values(incomes),
        backgroundColor: '#21C55D',
      },
      {
        label: 'Expenses',
        data: Object.values(expenses),
        backgroundColor: '#EF4444',
      },
    ],
  };
  return (
    <div className='flex flex-col items-center text-gray-100 my-4'>
      <Bar options={options} data={data} />
    </div>
  );
};

export default YearCategoriesGraph;

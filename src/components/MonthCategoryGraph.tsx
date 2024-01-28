import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartOptions,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { IExpense, IIncome } from '@/types/models';
import {
  getCategoryNamestoShow,
  getCategoryTotals,
  getGraphColors,
} from '@/utils/app.methods';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options: ChartOptions = {
  // events: ['click'],
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
  const { categoryTotals } = getCategoryTotals(incomeExpenseList);

  const data = {
    labels: getCategoryNamestoShow(
      incomeExpenseList,
      Object.fromEntries(categoryTotals),
    ),
    datasets: [
      {
        label: 'Total €',
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
        {categoryType}s by category
      </h1>
      {incomeExpenseList.length > 0 && <Pie data={data} options={options} />}
      {incomeExpenseList.length === 0 && (
        <p className='text-gray-400'>{`No ${categoryType} to display.`}</p>
      )}
    </div>
  );
}

export default MonthCategoriesGraph;

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
  const monthNamesWithIncomes = Object.keys(incomes);
  const monthNamesWithExpenses = Object.keys(expenses);
  const isIncomeBiggerThanExpenses = monthNamesWithIncomes.length > monthNamesWithExpenses.length;

  function getGraphLabels() {
    return Object.keys(isIncomeBiggerThanExpenses ? incomes : expenses);
  }

  function getIncomesBarData() {
    const incomesExpenseObj: { [monthName: string]: number } = {};

    if (isIncomeBiggerThanExpenses) {
      return incomes;
    }

    monthNamesWithExpenses.forEach((monthName) => {
      if (!monthNamesWithIncomes.includes(monthName)) {
        incomesExpenseObj[monthName] = 0;
      } else {
        incomesExpenseObj[monthName] = incomes[monthName];
      }
    });

    return incomesExpenseObj;
  }

  function getExpensesBarData() {
    const incomesExpenseObj: { [monthName: string]: number } = {};

    if (!isIncomeBiggerThanExpenses) {
      return expenses;
    }

    monthNamesWithIncomes.forEach((monthName) => {
      if (!monthNamesWithExpenses.includes(monthName)) {
        incomesExpenseObj[monthName] = 0;
      } else {
        incomesExpenseObj[monthName] = expenses[monthName];
      }
    });

    return incomesExpenseObj;
  }

  const data = {
    labels: getGraphLabels(),
    datasets: [
      {
        label: 'Incomes',
        data: Object.values(getIncomesBarData()),
        backgroundColor: '#21C55D',
      },
      {
        label: 'Expenses',
        data: Object.values(getExpensesBarData()),
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

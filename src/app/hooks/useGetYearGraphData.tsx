import { getYearIncomesExpensesBarData } from '@/utils/app.methods';
import { IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';

const useGetYearGraphData = (yearData: IYear, allOpenMonths: Date[]) => {
  function getBarData(year: IYear, eventType: string) {
    const allMonthNames = allOpenMonths.map(
      (date) => APP.monthsOfTheYear[date.getMonth()],
    );
    const incomesObj = getYearIncomesExpensesBarData(
      year.incomes,
      allMonthNames,
    );
    const expensesObj = getYearIncomesExpensesBarData(
      year.expenses,
      allMonthNames,
    );
    const isExpenses = eventType === APP.eventType.expense;
    const incomesExpensesObj: { [monthName: string]: number } = {};

    allMonthNames.forEach((monthName) => {
      incomesExpensesObj[monthName] = isExpenses
        ? expensesObj[monthName]
        : incomesObj[monthName];
    });

    return incomesExpensesObj;
  }

  const incomeBarData = Object.values(
    getBarData(yearData, APP.eventType.income),
  );
  const expenseBarData = Object.values(
    getBarData(yearData, APP.eventType.expense),
  );
  const monthNames = Object.keys(getBarData(yearData, APP.eventType.expense));

  return {
    incomeBarData,
    expenseBarData,
    monthNames,
  };
};

export default useGetYearGraphData;

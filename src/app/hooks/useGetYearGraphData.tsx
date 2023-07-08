import { getYearIncomesExpensesBarData } from '@/utils/app.methods';
import { IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';

const useGetYearGraphData = (yearData: IYear) => {
  function getBarData(yearData: IYear, eventType: string) {
    const incomes = getYearIncomesExpensesBarData(yearData.incomes);
    const expenses = getYearIncomesExpensesBarData(yearData.expenses);
    const isExpenses = eventType === APP.eventType.expense ? true : false;
    const allMonthNamesInIncomes = Object.keys(incomes);
    const allMonthNamesInExpenses = Object.keys(expenses);
    const isExpensesBiggerThanIncomes = allMonthNamesInExpenses.length > allMonthNamesInIncomes.length;
    const listWithoutAllMonthNames = isExpensesBiggerThanIncomes ? allMonthNamesInIncomes : allMonthNamesInExpenses;
    const listWithAllMonthNames = isExpensesBiggerThanIncomes ? allMonthNamesInExpenses : allMonthNamesInIncomes;
    const incomesExpenseObj: { [monthName: string]: number } = {};

    // expense include all existing month names
    if (isExpenses && isExpensesBiggerThanIncomes) {
      return expenses;
    }
    // income includes all existing month names
    if (!isExpenses && !isExpensesBiggerThanIncomes) {
      return incomes;
    }

    listWithAllMonthNames.forEach((monthName) => {
      if (listWithoutAllMonthNames.includes(monthName)) {
        incomesExpenseObj[monthName] = isExpenses ? expenses[monthName] : incomes[monthName];
      } else {
        incomesExpenseObj[monthName] = 0;
      }
    });

    return incomesExpenseObj;
  }

  const incomeBarData = Object.values(getBarData(yearData, APP.eventType.income));
  const expenseBarData = Object.values(getBarData(yearData, APP.eventType.expense));
  const monthNames = Object.keys(getBarData(yearData, APP.eventType.expense));

  return {
    incomeBarData,
    expenseBarData,
    monthNames,
  };
};

export default useGetYearGraphData;

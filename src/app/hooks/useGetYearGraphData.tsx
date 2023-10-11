import { getYearIncomesExpensesBarData } from '@/utils/app.methods';
import { IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';

const useGetYearGraphData = (yearData: IYear) => {
  function getBarData(yearData: IYear, eventType: string) {
    const incomesObj = getYearIncomesExpensesBarData(yearData.incomes);
    const expensesObj = getYearIncomesExpensesBarData(yearData.expenses);
    const isExpenses = eventType === APP.eventType.expense ? true : false;
    const allMonthNamesInIncomes = Object.keys(incomesObj);
    const allMonthNamesInExpenses = Object.keys(expensesObj);
    const isExpensesBiggerThanIncomes =
      allMonthNamesInExpenses.length > allMonthNamesInIncomes.length;
    const listWithLessMonthNames = isExpensesBiggerThanIncomes
      ? allMonthNamesInIncomes
      : allMonthNamesInExpenses;
    const listWithMoreMonthNames = isExpensesBiggerThanIncomes
      ? allMonthNamesInExpenses
      : allMonthNamesInIncomes;
    const incomesExpensesObj: { [monthName: string]: number } = {};

    // expense include all existing month names
    if (isExpenses && isExpensesBiggerThanIncomes) {
      return expensesObj;
    }
    // income includes all existing month names
    if (!isExpenses && !isExpensesBiggerThanIncomes) {
      return incomesObj;
    }

    listWithMoreMonthNames.forEach((monthName) => {
      if (listWithLessMonthNames.includes(monthName)) {
        incomesExpensesObj[monthName] = isExpenses
          ? expensesObj[monthName]
          : incomesObj[monthName];
      } else {
        incomesExpensesObj[monthName] = 0;
      }
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

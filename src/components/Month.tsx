'use client';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { isSameMonth } from 'date-fns';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { IMonth, IYear } from '@/types/models';
import { APP } from '@/utils/app.constants';
import MonthEvents from '@/components/MonthEvents';
import MonthYearHeader from '@/components/MonthYearHeader';
import {
  IUserDataContext,
  UserDataContext,
} from '@/app/context/userData.context';

export default function Month(): JSX.Element {
  const { user } = useContext(AuthContext) as IAppContext;
  const { userMonths, handleUserData } = useContext(
    UserDataContext,
  ) as IUserDataContext;
  const [currentMonth, setCurrentMonth] = useState<IMonth | IYear | null>(null);
  const [monthIndex, setMonthIndex] = useState<number | null>(null);
  const [spentThisWeek, setSpentThisWeek] = useState<number | null>(null);
  const [monthId, setMonthId] = useState<string>('');
  const [weekBalance, setWeekBalance] = useState<number | null>(null);
  const [weekLimit, setWeekLimit] = useState<number>(150);
  const [showWeekBalance, setShowWeekBalance] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      handleUserData();
    }
  }, [user]);

  // to set the current month
  useEffect(() => {
    if (userMonths.length > 0) {
      const lastMonthIndex = userMonths.length - 1;
      let month = userMonths.find((oneMonth, i) => {
        if (isSameMonth(new Date(), oneMonth.createdAt)) {
          setMonthIndex(i);
          return oneMonth;
        }
      });
      if (month) {
        setCurrentMonth(month);
        setMonthId(month._id);
        return;
      }
      // set currentMonth to the last month of the array when current month is not open
      setCurrentMonth(userMonths[lastMonthIndex]);
      setMonthId(userMonths[lastMonthIndex]._id);
      setMonthIndex(lastMonthIndex);
    }
  }, [userMonths]);

  useEffect(() => {
    if (currentMonth && '_id' in currentMonth) {
      setMonthId(currentMonth._id);
    }

    // handles week balance
    if (currentMonth){

      let isCurrentMonth = isSameMonth(new Date(), currentMonth.createdAt!)
      let numberOfDaysFromPreviousMonth: number = getNumberOfDaysFromPreviousMonth() | 0;
      let weekDaysFromThisMonth: number[] = getWeekDaysOfCurrentMonth();
      
      const totalExpensesOfPreviousMonthWeekDays = getTotalExpensesOfLastMonthWeekDays(numberOfDaysFromPreviousMonth) | 0;
      const totalExpensesOfThisMonthWeekDays = getTotalExpensesOfThisMonthWeekDays(weekDaysFromThisMonth) | 0;
      const totalWeekExpenses = totalExpensesOfPreviousMonthWeekDays + totalExpensesOfThisMonthWeekDays;
   
      setSpentThisWeek(totalWeekExpenses);

      if('weekLimitAmount' in currentMonth) {
        setWeekBalance(currentMonth.weekLimitAmount! - totalWeekExpenses)
        setWeekLimit(currentMonth.weekLimitAmount!)
      } else {
        setWeekBalance(weekLimit - totalWeekExpenses)
      }

      setShowWeekBalance(isCurrentMonth)
    }

  }, [currentMonth]);
  
  function getTotalExpensesOfLastMonthWeekDays(numberOfDaysFromPreviousMonth: number):number {
    const LAST_DAY_OF_MONTH =  0;
    const DECEMBER =  11;
    const todaysDate = new Date();
    const previousYear =  todaysDate.getFullYear() - 1;
    const isPrevMonthFromThisYear = todaysDate.getMonth() !== 0;
    let yearOfPrevMonth = isPrevMonthFromThisYear ? todaysDate.getFullYear() : previousYear;
    let previousMonthNumber = isPrevMonthFromThisYear ? todaysDate.getMonth() - 1 : DECEMBER;
    let previousMonth = userMonths.find(m => new Date(m.createdAt).getFullYear() === yearOfPrevMonth && new Date(m.createdAt).getMonth() === previousMonthNumber);
    // must have "previousMonthNumber + 1" because LAST_DAY_OF_MONTH being 0 makes us get the month before the one we want
    const lastDayOfPreviousMonth = new Date(yearOfPrevMonth, previousMonthNumber + 1, LAST_DAY_OF_MONTH).getDate();
    let daysTotalExpenses = 0;

    for (let index = 0; index < numberOfDaysFromPreviousMonth; index++) {

      let dayExpenses = previousMonth?.expenses.filter(e => new Date(e.createdAt).getUTCDate() === lastDayOfPreviousMonth - index);
      let allExpensesAmount = dayExpenses?.map(e => e.amount);
      let sum = allExpensesAmount?.reduce((total, num) => total + num);
      daysTotalExpenses += sum!;
    }
    return daysTotalExpenses;
  }

  function getTotalExpensesOfThisMonthWeekDays(weekDaysFromThisMonth: number[]): number {
    let totalWeekExpenses = 0;
    currentMonth?.expenses.forEach((e) => {
      let dayDate = new Date(e.createdAt).getUTCDate();
     
      if (weekDaysFromThisMonth.includes(dayDate) && e.category.toLowerCase() !== 'bills') {
        totalWeekExpenses += e.amount;
      }
    });
    return totalWeekExpenses;
  }

  function getWeekDaysOfCurrentMonth():number[] {
    const todaysDate = new Date();
    const weekDayNumber = todaysDate.getUTCDay();
    let dayOfTheMonth = todaysDate.getUTCDate();
    const weekDaysFromThisMonth: number[] = [];

    for (let index = 0; index <= weekDayNumber; index++) {
      const day = dayOfTheMonth - index;
      if (day >= 0) {
        weekDaysFromThisMonth.push(day);
      }
    }
    return weekDaysFromThisMonth;
  }
  function getNumberOfDaysFromPreviousMonth():number {
    const todaysDate = new Date();
    const weekDayNumber = todaysDate.getUTCDay();
    let dayOfTheMonth = todaysDate.getUTCDate();
    let numberOfDaysFromPreviousMonth: number = 0;

    for (let index = 0; index <= weekDayNumber; index++) {
      const day = dayOfTheMonth - index;
      if (day < 0) {
        numberOfDaysFromPreviousMonth++;
      }
    }
    return numberOfDaysFromPreviousMonth;
  }

  return (
    <section className="w-full sm:w-80">
      {currentMonth && userMonths.length > 0 && (
        <div className="w-full">
          <MonthYearHeader
            userMonthsYears={userMonths}
            index={monthIndex}
            currentMonthYear={currentMonth}
            setCurrentMonthYear={setCurrentMonth}
            setIndex={setMonthIndex}
          />
          
          { showWeekBalance && spentThisWeek && <div className="flex flex-col p-4 mt-4 items-center justify-around h-40 border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300">
            <div className="flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100 mb-2">

              <div className="flex flex-col text-center text-md font-semibold">
                <h2>
                  Week Balance
                </h2>
                <span
                  className={clsx(
                    weekBalance! >= 0 ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {APP.currency.format(weekBalance!)}
                </span>
              </div>
              
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100">
                <h6 className="font-medium capitalize">{APP.eventType.weekLimit}</h6>
                <span className="text-green-500">
                  {weekLimit}
                </span>
              </div>
              <div className="flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100">
                <h6 className="font-medium capitalize">{APP.eventType.weekSpent}</h6>
                <span className="text-red-500">
                  {spentThisWeek}
                </span>
              </div>
            </div>
          </div>}

          <MonthEvents
            events={currentMonth.incomes}
            eventType={APP.eventType.income}
            monthId={monthId}
          />
          <MonthEvents
            events={currentMonth.expenses}
            eventType={APP.eventType.expense}
            monthId={monthId}
          />
        </div>
      )}
    </section>
  );
}

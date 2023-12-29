'use client';
import { useContext, useEffect, useState } from 'react';
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
    const myDate = new Date();

    let dayOfTheWeek = myDate.getUTCDay();
    let dayOfTheMonth = myDate.getUTCDate();
    let totalWeekExpenses = 0
    let daysFromPreviousMonth = 0;
    
    // get all week days
    let allWeekDaysDates: any = [];
    
    for (let index = 0; index <= myDate.getUTCDay(); index++) {
     
      // set number of days that belongs to previous month
      if(dayOfTheMonth - index < 0){
        daysFromPreviousMonth++

      } else {
        allWeekDaysDates.push(dayOfTheMonth - index)
      }
    }

    // calculate expenses total 
    currentMonth?.expenses.forEach((e, i) => {
      let expenseDay = new Date(e.createdAt).getUTCDate();

      if(allWeekDaysDates.includes(expenseDay) && e.category.toLowerCase() !== 'bills'){
        totalWeekExpenses += e.amount
      }
    })

    // get previous month and add expenses from last number of days

    const isPrevMonthFromThisYear = new Date().getMonth() !== 0;
    let yearOfPrevMonth = isPrevMonthFromThisYear ? new Date().getFullYear() : new Date().getFullYear() - 1;
    let previousMonthNumber = isPrevMonthFromThisYear ? new Date().getMonth() - 1 : 11;
    // must have +1 because of the 0 representing the last day of the month
    const lastDayOfPreviousMonth = new Date(yearOfPrevMonth, previousMonthNumber + 1, 0).getDate();


    // find previous month

    let previousMonth = userMonths.find(m => new Date(m.createdAt).getFullYear() === yearOfPrevMonth && new Date(m.createdAt).getMonth() === previousMonthNumber);

  
    // loop through the number of days in the previous month

    for (let index = 0; index < daysFromPreviousMonth; index++){

      let dayExpenses = previousMonth?.expenses.filter(e => new Date(e.createdAt).getUTCDate() === lastDayOfPreviousMonth - index)

      let allExpensesAmount = dayExpenses?.map(e => e.amount)

      let sum = allExpensesAmount?.reduce((total, num) => total + num)

      totalWeekExpenses += sum!
    }

    setSpentThisWeek(totalWeekExpenses);


  }, [currentMonth]);

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
          {spentThisWeek && <div> <span>Spent: </span> <span>{spentThisWeek}</span></div>}
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

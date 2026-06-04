import {
  getTotalExpensesOfThisMonthWeekDays,
  getTotalExpensesOfLastMonthWeekDays,
} from '@/utils/app.methods';
import { IExpense, IMonth } from '@/types/models';

// Build a minimal IExpense with a UTC date set to a specific day-of-month
function makeExpense(
  dayOfMonth: number,
  amount: number,
  category: string,
  year = 2024,
  month = 0, // January
): IExpense {
  return {
    _id: `${dayOfMonth}-${category}`,
    title: 'test',
    category,
    amount,
    monthId: 'month1',
    createdAt: new Date(Date.UTC(year, month, dayOfMonth)),
    updatedAt: new Date(Date.UTC(year, month, dayOfMonth)),
  };
}

function makeMonth(expenses: IExpense[], year = 2024, month = 0): IMonth {
  return {
    _id: 'month1',
    incomes: [],
    expenses,
    userId: 'user1',
    createdAt: new Date(Date.UTC(year, month, 1)),
    updatedAt: new Date(Date.UTC(year, month, 1)),
    deleted: false,
  };
}

describe('getTotalExpensesOfThisMonthWeekDays', () => {
  const weekDays = [1, 2, 3]; // days 1, 2, 3 are in the current week

  it('sums all expenses when no categories are excluded', () => {
    const month = makeMonth([
      makeExpense(1, 10, 'food'),
      makeExpense(2, 20, 'bills'),
      makeExpense(3, 15, 'transport'),
      makeExpense(5, 100, 'food'), // day 5 not in week
    ]);

    expect(getTotalExpensesOfThisMonthWeekDays(weekDays, month)).toBe(45);
    expect(getTotalExpensesOfThisMonthWeekDays(weekDays, month, [])).toBe(45);
  });

  it('excludes expenses whose category matches (case-insensitive)', () => {
    const month = makeMonth([
      makeExpense(1, 10, 'food'),
      makeExpense(2, 20, 'bills'),
      makeExpense(3, 15, 'Bills'), // same category, different casing
    ]);

    expect(
      getTotalExpensesOfThisMonthWeekDays(weekDays, month, ['Bills']),
    ).toBe(10);
  });

  it('handles multiple excluded categories', () => {
    const month = makeMonth([
      makeExpense(1, 10, 'food'),
      makeExpense(2, 20, 'bills'),
      makeExpense(3, 15, 'transport'),
    ]);

    expect(
      getTotalExpensesOfThisMonthWeekDays(weekDays, month, [
        'bills',
        'transport',
      ]),
    ).toBe(10);
  });

  it('returns 0 when all expenses are excluded', () => {
    const month = makeMonth([
      makeExpense(1, 50, 'bills'),
      makeExpense(2, 30, 'bills'),
    ]);

    expect(
      getTotalExpensesOfThisMonthWeekDays(weekDays, month, ['bills']),
    ).toBe(0);
  });

  it('returns 0 when there are no expenses', () => {
    const month = makeMonth([]);
    expect(getTotalExpensesOfThisMonthWeekDays(weekDays, month)).toBe(0);
  });
});

describe('getTotalExpensesOfLastMonthWeekDays', () => {
  it('returns 0 when numberOfDays is 0', () => {
    const months: IMonth[] = [];
    expect(getTotalExpensesOfLastMonthWeekDays(0, months)).toBe(0);
  });

  it('returns 0 when previous month is not found', () => {
    // No months in the array → previous month will be undefined
    expect(getTotalExpensesOfLastMonthWeekDays(2, [])).toBe(0);
  });
});

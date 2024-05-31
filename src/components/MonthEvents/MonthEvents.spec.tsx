/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { AuthProviderWrapper } from '@/app/context/auth.context';
import MonthEvents from '@/components/MonthEvents/MonthEvents';

jest.mock('@/services/incomesExpenses.services');

const contextWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProviderWrapper>
    <UserDataProviderWrapper>{children}</UserDataProviderWrapper>
  </AuthProviderWrapper>
);

describe('IncomeExpense Component', () => {
  const mockExpenses = [
    {
      _id: '1',
      title: 'Mock Expense 1',
      category: 'extra',
      amount: 100,
      createdAt: new Date('Apr 1, 2024'),
      updatedAt: new Date('Apr 1, 2024'),
      monthId: '4',
    },
    {
      _id: '2',
      title: 'Mock Expense 2',
      category: 'extra',
      amount: 100,
      createdAt: new Date('Apr 1, 2024'),
      updatedAt: new Date('Apr 1, 2024'),
      monthId: '4',
    },
  ];

  const mockEventType = 'expense';
  const monthId = '4';

  beforeEach(() => {
    render(
      <MonthEvents
        events={mockExpenses}
        eventType={mockEventType}
        monthId={monthId}
      />,
      { wrapper: contextWrapper },
    );
  });

  it('should render the month expenses with the provided props', () => {
    expect(screen.getByText('Mock Expense 2')).toBeInTheDocument();
  });

  it('should open the add expense modal on button click', () => {
    fireEvent.click(screen.getByTestId('add-income-expense'));
    expect(screen.getByText('expense')).toBeInTheDocument();
  });
});

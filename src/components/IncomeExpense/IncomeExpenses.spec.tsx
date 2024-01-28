/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncomeExpense } from '@/components/IncomeExpense/IncomeExpense';
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { AuthProviderWrapper } from '@/app/context/auth.context';
import ModalCustom from '@/components/ModalCustom';

jest.mock('@/services/incomesExpenses.services');

const contextWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProviderWrapper>
    <UserDataProviderWrapper>{children}</UserDataProviderWrapper>
  </AuthProviderWrapper>
);

describe('IncomeExpense Component', () => {
  const mockExpense = {
    _id: '1',
    title: 'Mock Expense',
    category: 'extra',
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    monthId: '2',
  };

  const mockEventType = 'expense';

  beforeEach(() => {
    render(
      <IncomeExpense incomeExpense={mockExpense} eventType={mockEventType} />,
      { wrapper: contextWrapper },
    );
  });

  it('should render the income or expense with the provided props', () => {
    expect(screen.getByText('Mock Expense')).toBeInTheDocument();
  });

  it('should open the delete confirmation modal on button click', () => {
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  it('should call the handleDeleteIncomeExpense function when modal is confirmed', async () => {
    const handleDeleteIncomeExpense = jest.fn();
    render(
      <ModalCustom
        setIsModalOpen={() => {}}
        mainFunction={handleDeleteIncomeExpense}
        question={mockExpense.title}
        buttonText='Delete'
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(handleDeleteIncomeExpense).toHaveBeenCalledTimes(1);
  });
});

/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncomeExpense } from '@/components/IncomeExpense/IncomeExpense';
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { AuthProviderWrapper } from '@/app/context/auth.context';
import ModalCustom from '@/components/ModalCustom';
import { I18nWrapper } from '@/test-utils/i18n';

jest.mock('@/services/incomesExpenses.services');
jest.mock('@/app/providers/LocaleProvider', () => ({
  useLocale: () => ({ locale: 'en', setLocale: jest.fn() }),
  LocaleProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const contextWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nWrapper>
    <AuthProviderWrapper>
      <UserDataProviderWrapper>{children}</UserDataProviderWrapper>
    </AuthProviderWrapper>
  </I18nWrapper>
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
      <I18nWrapper>
        <ModalCustom
          setIsModalOpen={() => {}}
          mainFunction={handleDeleteIncomeExpense}
          question={mockExpense.title}
          buttonText='Delete'
        />
      </I18nWrapper>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(handleDeleteIncomeExpense).toHaveBeenCalledTimes(1);
  });
});

/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { AuthProviderWrapper } from '@/app/context/auth.context';
import ModalCreateIncomeExpense from '@/components/ModalCreateIncomeExpense/ModalCreateIncomeExpense';
import { I18nWrapper } from '@/test-utils/i18n';

jest.mock('@/services/incomesExpenses.services');

const contextWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nWrapper>
    <AuthProviderWrapper>
      <UserDataProviderWrapper>{children}</UserDataProviderWrapper>
    </AuthProviderWrapper>
  </I18nWrapper>
);

describe('IncomeExpense Component', () => {
  const mockEventType = 'expense';

  beforeEach(() => {
    render(
      <ModalCreateIncomeExpense
        setIsModalOpen={() => {}}
        monthId='2'
        eventType={mockEventType}
      />,
      { wrapper: contextWrapper },
    );
  });

  it('should render the add income/expense modal', () => {
    expect(screen.getByText('expense')).toBeInTheDocument();
  });
});

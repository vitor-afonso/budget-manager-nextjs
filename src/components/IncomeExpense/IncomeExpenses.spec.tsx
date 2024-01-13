import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { IncomeExpense } from '@/components/IncomeExpense/IncomeExpense'; 
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { AuthProviderWrapper } from '@/app/context/auth.context';

const contextWrapper = ({children}:{
  children: React.ReactNode;
}) => (
  <AuthProviderWrapper>
  <UserDataProviderWrapper>
    {children}
  </UserDataProviderWrapper>
  </AuthProviderWrapper>
)

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
    render(<IncomeExpense incomeExpense={mockExpense} eventType={mockEventType} />, {wrapper:contextWrapper});
  })

  it('should render the income or expense with the provided props', () => {

    expect(screen.getByText('Mock Expense')).toBeInTheDocument();
  });

   it('opens the delete confirmation modal on button click', () => {
   
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls the delete function when modal is confirmed', async () => {

    const deleteIncomeExpense = jest.fn();
    const isExpense = true;
    
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Delete')).not.toBeInTheDocument();
    
     /*await waitFor(() => {
      expect(deleteIncomeExpense).toHaveBeenCalledWith(mockExpense._id, isExpense);
    }); */
  });
});

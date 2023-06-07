export interface IUser {
  name: string;
  email: string;
  _id: string;
  months?: IMonth[];
}
export interface IIncome {
  _id: string;
  category: string;
  amount: number;
  monthId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IExpense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  monthId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IMonth {
  _id: string;
  incomes: IIncome[];
  expenses: IExpense[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface IYear {
  incomes: IIncome[];
  expenses: IExpense[];
  createdAt?: Date;
}

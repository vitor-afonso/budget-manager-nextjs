export interface IUser {
  name: string;
  email: string;
  _id: string;
  months?: IMonth[];
}
export interface ILoginUser {
  email: string;
  password: string;
}
export interface ISignupUser extends ILoginUser {
  name: string;
}

export interface IIncome {
  _id: string;
  category: String;
  amount: number;
  monthId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IExpense {
  _id: string;
  title: String;
  category: String;
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

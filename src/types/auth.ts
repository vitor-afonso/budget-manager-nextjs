export interface ILoginUser {
  email: string;
  password: string;
}
export interface ISignupUser extends ILoginUser {
  name: string;
}

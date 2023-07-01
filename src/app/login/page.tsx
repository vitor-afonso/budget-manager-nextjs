'use client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, IAppContext } from '@/app/auth.context';
import { login } from '@/services/auth';
import { APP } from '@/utils/app.constants';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const { storeToken, authenticateUser, isLoadingContext, user, logOutUser } = useContext(AuthContext) as IAppContext;

  const handleState = (e: ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      if (!data.authToken) {
        setErrorMessage(data.message);
        return;
      }
      storeToken(data.authToken);
      await authenticateUser();
      router.push(APP.pageRoutes.home);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {!user && (
        <form noValidate onSubmit={handleSubmit}>
          <input type='text' value={email} onChange={(e) => handleState(e, setEmail)} />
          <input type='password' value={password} onChange={(e) => handleState(e, setPassword)} />
          <button>Submit</button>
        </form>
      )}

      {errorMessage && <p className='text-red-500 capitalize'>{errorMessage}</p>}

      {isLoadingContext && <p>Loading...</p>}
    </div>
  );
};

export default Login;

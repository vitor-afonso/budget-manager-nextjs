'use client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { AuthContext, IAppContext } from '@/src/app/auth.context';
import { login } from '@/src/app/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { storeToken, authenticateUser, isLoadingContext, user, logOutUser } = useContext(AuthContext) as IAppContext;

  const handleState = (e: ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await login({ email, password });

      if (!data.authToken) throw new Error(data.message);

      storeToken(data.authToken);

      await authenticateUser();

      router.push('/');
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
          <button type='submit'>Submit</button>
        </form>
      )}

      {isLoadingContext && <p>Loading...</p>}

      {user && (
        <>
          <p>{user.name} is in tha house! 🙌</p>
          <button onClick={() => logOutUser()}>Logout</button>
          <br />
          <Link href={'/'}>Go to Month Section</Link>
        </>
      )}
    </div>
  );
};

export default Login;

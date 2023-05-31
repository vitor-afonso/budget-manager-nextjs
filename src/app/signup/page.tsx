'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/services/auth';
import { APP } from '@/utils/app.constants';

const Signup = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleState = (e: ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    setState(e.target.value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await signup({ email, password, name });
      router.push(APP.pageRoutes.login);
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>Signup</h1>(
      <form noValidate onSubmit={handleSubmit}>
        <input type='text' value={name} onChange={(e) => handleState(e, setName)} />
        <input type='text' value={email} onChange={(e) => handleState(e, setEmail)} />
        <input type='password' value={password} onChange={(e) => handleState(e, setPassword)} />
        {!isLoading && <button>Submit</button>}
      </form>
      ){errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Signup;

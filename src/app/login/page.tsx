'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { AuthContext, IAppContext } from '@/app/context/auth.context';
import { login } from '@/services/auth';
import { APP } from '@/utils/app.constants';
import { useForm } from 'react-hook-form';
import Spinner from '@/components/Spinner';
import InputText from '@/components/InputText';
import Button from '@/components/Button';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});
//get type from schema
type FormData = z.infer<typeof schema>;

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { storeToken, authenticateUser, user } = useContext(
    AuthContext,
  ) as IAppContext;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleLoginSubmit = async ({ email, password }: FormData) => {
    setIsLoading(!isLoading)
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
    } finally {
      setIsLoading(!isLoading)
    }
  };

  return (
    <div>

      {!user && (
        <>
        <h1 className="font-semibold text-lg uppercase mb-6 text-center text-gray-300">
          {APP.buttonAction.login}
        </h1>
      
        <form
          onSubmit={handleSubmit(handleLoginSubmit)}
          className="mb-0 space-y-2"
        >
          <InputText
            register={register}
            errors={errors}
            inputName={APP.inputName.email}
            inputRules={APP.formRules.email}
          />
          <InputText
            register={register}
            errors={errors}
            inputName={APP.inputName.password}
            inputType={APP.inputName.password}
            inputRules={APP.formRules.loginPassword}
          />
          <div className="flex justify-center !mt-12">
            {isLoading ? (
              <Spinner />
            ) : (
              <Button> {APP.buttonAction.login} </Button>
            )}
          </div>
        </form>
        </>
      )}

      {errorMessage && (
        <p className="text-red-500 capitalize">{errorMessage}</p>
      )}
    </div>
  );
};

export default Login;

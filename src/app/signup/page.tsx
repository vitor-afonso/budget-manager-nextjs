'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signup } from '@/services/auth';
import { APP } from '@/utils/app.constants';
import InputText from '@/components/InputText';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

function Signup() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleSignupSubmit = async ({
    name,
    email,
    password,
  }: FormData): Promise<void> => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await signup({ email, password, name });
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
      <h1 className="font-semibold text-lg uppercase mb-6 text-center text-gray-300">
        {APP.buttonAction.signup}
      </h1>
      <form
        noValidate
        onSubmit={handleSubmit(handleSignupSubmit)}
        className="mb-4 space-y-2"
      >
        <InputText
          register={register}
          errors={errors}
          inputName={APP.inputName.name}
          inputRules={APP.formRules.name}
        />
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
          inputRules={APP.formRules.signupPassword}
        />

        <div className="flex justify-center !mt-12">
          {isLoading ? (
            <Spinner />
          ) : (
            <Button> {APP.buttonAction.signup} </Button>
          )}
        </div>
      </form>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}

export default Signup;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { signup } from '@/services/auth';
import { APP } from '@/utils/app.constants';
import InputText from '@/components/InputText';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { useFormRules } from '@/app/hooks/useFormRules';
import { translateApiError } from '@/utils/translateApiError';

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
  const t = useTranslations('nav');
  const tErrors = useTranslations('apiErrors');
  const formRules = useFormRules();

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
      const res = await signup({ email, password, name });
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(translateApiError(data.message, tErrors));
        return;
      }
      router.push(APP.pageRoutes.login);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorMessage(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className='font-semibold text-lg uppercase mb-6 text-center text-gray-300'>
        {t('signup')}
      </h1>
      <form
        noValidate
        onSubmit={handleSubmit(handleSignupSubmit)}
        className='mb-4 space-y-2'
      >
        <InputText
          register={register}
          errors={errors}
          inputName={APP.inputName.name}
          inputRules={formRules.name}
        />
        <InputText
          register={register}
          errors={errors}
          inputName={APP.inputName.email}
          inputRules={formRules.email}
        />
        <InputText
          register={register}
          errors={errors}
          inputName={APP.inputName.password}
          inputType={APP.inputName.password}
          inputRules={formRules.signupPassword}
        />

        <div className='flex justify-center !mt-12'>
          {isLoading ? <Spinner /> : <Button> {t('signup')} </Button>}
        </div>
      </form>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
}

export default Signup;

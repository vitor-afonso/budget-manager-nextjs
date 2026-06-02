'use client';

import { useTranslations } from 'next-intl';

export function useFormRules() {
  const t = useTranslations('forms.validation');

  return {
    name: { required: t('nameRequired') },
    email: { required: t('emailRequired') },
    loginPassword: { required: t('passwordRequired') },
    signupPassword: {
      required: t('passwordRequired'),
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        message: t('passwordPattern'),
      },
    },
    title: { required: t('titleRequired') },
    category: { required: t('categoryRequired') },
    amount: {
      required: t('amountRequired'),
      pattern: { value: /^[0-9]*\.?[0-9]*$/, message: t('amountInvalid') },
    },
    weekLimitAmount: {
      pattern: { value: /^[0-9]*\.?[0-9]*$/, message: t('weekLimitInvalid') },
    },
    month: {
      required: t('monthRequired'),
    },
    date: {
      required: t('dateRequired'),
    },
  };
}

export const APP = {
  name: 'Budget manager',
  localStorage: {
    authToken: 'authToken',
  },
  eventType: {
    income: 'income',
    expense: 'expense',
    month: 'month',
    year: 'year',
  },
  formRules: {
    name: {
      required: true,
    },
    email: {
      required: true,
    },
    loginPassword: {
      required: true,
    },
    signupPassword: {
      required: true,
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        message: '__passwordPattern__',
      },
    },
    title: {
      required: true,
    },
    category: {
      required: true,
    },
    amount: {
      required: true,
      pattern: { value: /^[0-9]*\.?[0-9]*$/, message: '__amountInvalid__' },
    },
    weekLimitAmount: {
      pattern: { value: /^[0-9]*\.?[0-9]*$/, message: '__weekLimitInvalid__' },
    },
  },
  inputName: {
    name: 'name',
    email: 'email',
    password: 'password',
    date: 'date',
    title: 'title',
    category: 'category',
    amount: 'amount',
    month: 'month',
    weekLimitAmount: 'weekLimitAmount',
  },
  buttonAction: {
    prev: 'prev',
    next: 'next',
  },
  pageRoutes: {
    home: '/',
    month: '/month',
    year: '/year',
    login: '/login',
    signup: '/signup',
  },
  images: {
    logo: '/images/budget_manager_logo_1.png',
  },
  monthsOfTheYear: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  graphColdColors: [
    '#7FA2C0',
    '#419CAA',
    '#057692',
    '#004D6A',
    '#002842',
    '#00131F',
    '#000C16',
    '#00060D',
    '#000105',
    '#000001',
  ],
  graphWarmColors: [
    '#FFDFB3',
    '#FFAD66',
    '#FF7F1A',
    '#E86100',
    '#BF4800',
    '#973100',
    '#832600',
    '#6F1B00',
    '#5B0F00',
    '#470400',
    '#330000',
  ],
  //projectApi: 'https://budget-manager-server.onrender.com/api',
  projectApi: 'http://localhost:5005/api',
};

export function getCurrencyFormatter(locale: string) {
  return Intl.NumberFormat(locale === 'pt-PT' ? 'pt-PT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
  });
}

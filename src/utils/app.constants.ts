export const APP = {
  name: 'Budget manager',
  currency: Intl.NumberFormat('en-PT', {
    style: 'currency',
    currency: 'EUR',
  }),
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
      required: 'Name is required',
    },
    email: {
      required: 'Email is required',
    },
    loginPassword: {
      required: 'Password is required',
    },
    signupPassword: {
      required: 'Password is required',
      pattern: {
        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
        message:
          'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
      },
    },
    title: {
      required: 'Title is required',
    },
    category: {
      required: 'Category is required',
    },
    amount: {
      required: 'Amount is required',
      pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Invalid value' },
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
  },
  buttonAction: {
    prev: 'prev',
    next: 'next',
    login: 'login',
    signup: 'register',
    openMonth: 'open month',
  },
  pageRoutes: {
    home: '/',
    month: '/month',
    year: '/year',
    login: '/login',
    signup: '/signup',
  },
  images: {
    logo: '/images/budget-transparent-medium.png',
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
  projectApi: `https://budget-manager-server.onrender.com/api`,
  //projectApi: `http://localhost:5005/api`,
};

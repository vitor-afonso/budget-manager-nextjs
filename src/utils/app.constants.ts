export const APP = {
  name: 'Budget manager',
  currency: '€',
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
    email: 'email',
    password: 'password',
    date: 'date',
    title: 'title',
    category: 'category',
    amount: 'amount',
  },
  buttonAction: {
    prev: 'prev',
    next: 'next',
    login: 'login',
    newMonth: 'open new month',
  },
  pageRoutes: {
    home: '/',
    month: '/month',
    year: '/year',
    login: '/login',
    signup: '/signup',
  },
  monthsOfTheYear: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  graphColdColors: ['#7FA2C0', '#419CAA', '#057692', '#004D6A', '#002842', '#00131F', '#000C16', '#00060D', '#000105', '#000001'],
  graphWarmColors: ['#FFDFB3', '#FFAD66', '#FF7F1A', '#E86100', '#BF4800', '#973100', '#832600', '#6F1B00', '#5B0F00', '#470400', '#330000'],
  projectApi: `https://budget-manager-server.onrender.com/api`,
  //projectApi: `http://localhost:5005/api`,
};

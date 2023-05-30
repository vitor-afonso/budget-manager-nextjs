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
  projectApi: `http://localhost:5005/api`,
};

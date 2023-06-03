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
  graphColdColors: ['#7FA2C0', '#419CAA', '#057692', '#004D6A', '#002842', '#00131F', '#000C16', '#00060D', '#000105', '#000001'],
  graphWarmColors: ['#FFDFB3', '#FFAD66', '#FF7F1A', '#E86100', '#BF4800', '#973100', '#832600', '#6F1B00', '#5B0F00', '#470400', '#330000'],
  projectApi: `http://localhost:5005/api`,
};

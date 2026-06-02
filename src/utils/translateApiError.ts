type TFunction = (key: string) => string;

const API_ERROR_MAP: Record<string, string> = {
  'Provide email, password and name': 'provideEmailPasswordName',
  'Provide a valid email address.': 'invalidEmail',
  'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.':
    'passwordRules',
  'User already exists.': 'userExists',
  'Provide email and password.': 'provideEmailPassword',
  'User not found.': 'userNotFound',
  'Unable to authenticate the user': 'authFailed',
};

export function translateApiError(message: string, t: TFunction): string {
  const key = API_ERROR_MAP[message];
  if (key) return t(key);
  return message;
}

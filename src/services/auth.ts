import { ILoginUser, ISignupUser } from '@/types/auth';
import { APP } from '@/utils/app.constants';

export const signup = async (requestBody: ISignupUser) => {
  const res = await fetch(`${APP.projectApi}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  return res;
};

export const login = async (requestBody: ILoginUser) => {
  const res = await fetch(`${APP.projectApi}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json();
  return data;
};

export const verify = async (storedToken: string) => {
  const res = await fetch(`${APP.projectApi}/verify`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storedToken}`,
    },
  });
  const data = await res.json();
  return data;
};

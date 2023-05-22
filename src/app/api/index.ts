import { ILoginUser, ISignupUser } from '@/src/types';

const API_URL = `http://localhost:5005/api`;

/************************* MONTHS *****************************/

export const getUserMonths = async (userId: string | undefined) => {
  const res = await fetch(`${API_URL}/months/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });
  const data = await res.json();
  return data;
};

/************************* AUTH *****************************/

export const signup = async (requestBody: ISignupUser) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json();
  return res;
};

export const login = async (requestBody: ILoginUser) => {
  const res = await fetch(`${API_URL}/login`, {
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
  const res = await fetch(`${API_URL}/verify`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storedToken}`,
    },
  });
  const data = await res.json();
  return data;
};

import { parseISO } from 'date-fns';
import { APP } from '@/utils/app.constants';

export const getUserMonths = async (userId: string | undefined) => {
  const res = await fetch(`${APP.projectApi}/months/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });
  const data = await res.json();
  const userMonths = data.map((month: any) => {
    // parse date before sending it to context
    return { ...month, createdAt: parseISO(month.createdAt), updatedAt: parseISO(month.updatedAt) };
  });
  return userMonths;
};

export const createMonth = async (userId: string) => {
  try {
    const res = await fetch(`${APP.projectApi}/months`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ userId }),
    });
    let month = await res.json();
    // parse date before sending it to component
    return { ...month, createdAt: parseISO(month.createdAt), updatedAt: parseISO(month.updatedAt) };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

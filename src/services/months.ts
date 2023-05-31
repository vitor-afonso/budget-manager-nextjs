import { APP } from '@/utils/app.constants';

/************************* MONTHS *****************************/

export const getUserMonths = async (userId: string | undefined) => {
  const res = await fetch(`${APP.projectApi}/months/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });
  const data = await res.json();
  return data;
};

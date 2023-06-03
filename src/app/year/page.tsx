'use client';
import { useContext, useEffect, useState } from 'react';
import { isSameYear } from 'date-fns';
import { AuthContext, IAppContext } from '../auth.context';
import { IMonth } from '@/types/models';

const YearInfo = () => {
  const { userMonths } = useContext(AuthContext) as IAppContext;
  const [yearMonths, setYearMonths] = useState<IMonth[] | null>(null);
  // set current month
  useEffect(() => {
    if (userMonths.length > 0) {
      let months = userMonths.filter((oneMonth) => isSameYear(new Date(), oneMonth.createdAt));
      if (months.length > 0) {
        console.log('Year months set and done! =>', months);
        setYearMonths(months);
      }
    }
  }, [userMonths]);
  return <div>Year details</div>;
};

export default YearInfo;

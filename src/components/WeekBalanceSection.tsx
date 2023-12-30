import React from 'react'
import { APP } from '@/utils/app.constants'
import clsx from 'clsx'
interface Props {
    weekBalance: number | null, 
    weekLimit: number | null, 
    spentThisWeek: number | null
}

const WeekBalanceSection = ({weekBalance, weekLimit, spentThisWeek}:Props) => {
  return (
    <div className="flex flex-col p-4 mt-4 items-center justify-around h-40 border border-black min-w-80 w-full rounded-3xl text-lg bg-slate-300">
            <div className="flex items-center justify-around p-2 border border-black w-full rounded-3xl text-lg bg-slate-100 mb-2">

              <div className="flex flex-col text-center text-md font-semibold">
                <h2>
                  Week Balance
                </h2>
                <span
                  className={clsx(
                    weekBalance! >= 0 ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {APP.currency.format(weekBalance!)}
                </span>
              </div>
              
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100">
                <h6 className="font-medium capitalize">{APP.eventType.weekLimit}</h6>
                <span className="text-green-500">
                  {APP.currency.format(weekLimit!)}
                </span>
              </div>
              <div className="flex flex-col border border-black text-xs rounded-3xl h-10 w-32  items-center justify-center bg-slate-100">
                <h6 className="font-medium capitalize">{APP.eventType.weekSpent}</h6>
                <span className="text-red-500">
                  {APP.currency.format(spentThisWeek!)}
                </span>
              </div>
            </div>
          </div>
  )
}

export default WeekBalanceSection

import { capitalize } from 'lodash';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { getEventCreationDate } from '@/utils/app.methods';
import clsx from 'clsx';

interface Props {
  events: IIncome[] | IExpense[];
  eventType: string;
}

const MonthEvents = ({ events, eventType }: Props): JSX.Element => {
  return (
    <div className='flex flex-col justify-between pb-4 border border-black max-h-64 rounded-3xl mt-4 bg-slate-200 w-full'>
      <div className='mb-2 w-full'>
        <div className='border border-black text-xl rounded-3xl h-10 w-full flex items-center justify-center bg-slate-100'>
          <h2>{eventType === APP.eventType.income ? 'Incomes' : 'Expenses'}</h2>
        </div>
        <div className={clsx(screen.height < 800 ? 'max-h-20' : 'max-h-32', 'pb-2 pl-5 mt-5 mr-5 overflow-y-auto')}>
          {events.map((oneEvent: IIncome | IExpense) => (
            <div key={oneEvent._id} className='flex justify-between items-center mb-2 last:mb-0 '>
              <div className='text-left leading-none '>
                {eventType === APP.eventType.income && <p className='text-md truncate'>{capitalize(oneEvent.category)}</p>}
                {eventType === APP.eventType.expense && <p className='text-md truncate'>{capitalize(oneEvent.title)}</p>}
                <span className='text-xs'>{getEventCreationDate(oneEvent.createdAt, eventType)}</span>
              </div>
              <div className='flex items-center text-md'>
                <p>{oneEvent.amount + APP.currency}</p>
                <button className='rounded-full bg-slate-300 w-5 h-5 flex justify-center items-center mx-1'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='5' stroke='currentColor' className='w-4 h-4 text-red-500'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className='self-center rounded-full bg-slate-300 w-8 h-8 flex justify-center items-center'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='3' stroke='currentColor' className='w-8 h-8 text-blue-500'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  );
};

export default MonthEvents;

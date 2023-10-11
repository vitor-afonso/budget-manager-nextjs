import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { IExpense, IIncome } from '@/types/models';
import { APP } from '@/utils/app.constants';
import { IncomeExpense } from '@/components/IncomeExpense';
import ModalCreateIncomeExpense from '@/components/ModalCreateIncomeExpense';

interface Props {
  events: IIncome[] | IExpense[];
  eventType: string;
  monthId: string;
}

const MonthEvents = ({ events, eventType, monthId }: Props): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    events.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
    );
  }, [events]);

  return (
    <div className="flex flex-col justify-between pb-4 border border-black max-h-64 rounded-3xl mt-4 bg-slate-200 w-full">
      <div className="mb-2 w-full">
        <div className="border border-black text-xl rounded-3xl h-10 w-full flex items-center justify-center bg-slate-100">
          <h2 className="font-semibold">
            {eventType === APP.eventType.income ? 'Incomes' : 'Expenses'}
          </h2>
        </div>
        <div
          className={clsx(
            screen.height < 800 ? 'max-h-20' : 'max-h-32',
            'pb-2 pl-5 mt-5 mr-5 overflow-y-auto',
          )}
        >
          {events.map((incomeExpense) => (
            <IncomeExpense
              key={incomeExpense._id}
              incomeExpense={incomeExpense}
              eventType={eventType}
            />
          ))}
        </div>
      </div>
      <button
        className="self-center rounded-full bg-slate-300 w-8 h-8 flex justify-center items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3"
          stroke="currentColor"
          className="w-8 h-8 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      {isModalOpen && (
        <ModalCreateIncomeExpense
          setIsModalOpen={setIsModalOpen}
          monthId={monthId}
          eventType={eventType}
        />
      )}
    </div>
  );
};

export default MonthEvents;

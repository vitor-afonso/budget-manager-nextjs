import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/* const schema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  age: z.number().min(10),
}); */
const schema = z.object({
  userId: z.string(),
});

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalCreateIncomeExpense = ({ isModalOpen, setIsModalOpen }: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleCreateMonth = () => {
    setIsModalOpen(false);
    // call createMonth(some data)
    // upddate userMonths
  };
  return (
    <div className='absolute top-0 left-0 z-10 w-screen h-screen '>
      <div className='absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs bg-slate-500 border-2 border-slate-800 rounded-3xl shadow-24 p-4 flex flex-col items-center'>
        <p className='text-gray-200'>Custom Modal</p>

        {/* <form onSubmit={handleSubmit((d) => console.log(d))}>
          <input {...register('name')} />
          {errors.name?.message && <p>{errors.name?.message}</p>}
          <input type="number" {...register('age', { valueAsNumber: true })} />
          {errors.age?.message && <p>{errors.age?.message}</p>}
          <input type="submit" />
        </form> */}
      </div>
      <div className='bg-black/50 w-full h-full absolute z-20' onClick={() => setIsModalOpen(false)}></div>
    </div>
  );
};

export default ModalCreateIncomeExpense;

import Image from 'next/image';

function Spinner({ size = 100 }: { size?: number }) {
  return (
    <div className='text-center'>
      <Image
        src='./images/budget-spinner.svg'
        alt='spinner'
        width={size}
        height={size}
      />
    </div>
  );
}

export default Spinner;

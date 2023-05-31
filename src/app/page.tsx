import Month from '@/components/Month';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className='flex flex-col justify-start items-center h-full w-full '>
      <Hero />
      <Month />
    </main>
  );
}

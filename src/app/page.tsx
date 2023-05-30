import Link from 'next/link';
import Month from '@/components/Month';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className='flex flex-col justify-start items-center p-5 h-screen w-screen '>
      <Hero />
      <Month />
    </main>
  );
}

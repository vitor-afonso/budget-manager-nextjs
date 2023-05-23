import Link from 'next/link';

import Month from '@/src/app/components/Month';

export default function Home() {
  return (
    <main>
      <h1>Landing Page</h1>
      {/* Add component that will hold the Month and the CreateMonth */}
      <Month />
      <Link href={'/login'}>Go to Login</Link>
    </main>
  );
}

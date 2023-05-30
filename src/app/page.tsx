import Month from '@/app/components/Month';

export default function Home() {
  return (
    <main>
      <h1>Landing Page</h1>
      {/* Add component that will hold the <Month /> and the <CreateMonth /> */}
      <Month />
    </main>
  );
}

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/app/auth.context';
import { getMonths } from '@/lib/mongodb/months';
import clsx from 'clsx';
import SideBar from '@/components/SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budget manager',
  description: 'Developed by Vitor A.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { months, error } = await getMonths();

  return (
    <html lang='en'>
      <body className={clsx(inter.className, 'bg-slate-700 p-4')}>
        <AuthProviderWrapper allMonths={months}>
          <SideBar />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

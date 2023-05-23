import '@/src/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/src/app/auth.context';
import { getMonths } from '@/src/lib/mongodb/months';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budget manager',
  description: 'Developed by Vitor A.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { months, error } = await getMonths();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProviderWrapper allMonths={months}>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

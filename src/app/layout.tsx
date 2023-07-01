import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/app/auth.context';
import clsx from 'clsx';
import SideBar from '@/components/SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budget manager',
  description: 'Developed by Vitor A.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={clsx(inter.className, 'bg-slate-700 p-4')}>
        <AuthProviderWrapper>
          <div className='max-w-[320px] mx-auto'>
            <SideBar />
            {children}
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

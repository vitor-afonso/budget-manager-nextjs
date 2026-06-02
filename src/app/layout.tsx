import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/app/context/auth.context';
import clsx from 'clsx';
import SideBar from '@/components/SideBar';
import { UserDataProviderWrapper } from '@/app/context/userData.context';
import { Toaster } from 'sonner';
import { LocaleProvider } from '@/app/providers/LocaleProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budget Manager',
  description: 'Developed by Vitor A.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-PT'>
      <body className={clsx(inter.className, 'bg-slate-700 py-6 h-full')}>
        <AuthProviderWrapper>
          <UserDataProviderWrapper>
            <LocaleProvider>
              <div className='w-80 mx-auto'>
                <SideBar />
                {children}
              </div>
            </LocaleProvider>
          </UserDataProviderWrapper>
        </AuthProviderWrapper>
        <Toaster position='top-center' richColors />
      </body>
    </html>
  );
}

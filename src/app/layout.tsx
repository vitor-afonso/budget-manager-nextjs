import '@/src/app/globals.css';
import { Inter } from 'next/font/google';
import { AuthProviderWrapper } from '@/src/app/auth.context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Budget manager',
  description: 'Developed by Vitor A.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

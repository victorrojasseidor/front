"use client"
import '../../styles/styles.scss';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { DataContextProvider } from '@/Context/DataContext';

const inter = Inter({ subsets: ['latin'] });

const links = [
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'register',
    route: '/register'
  },
  {
    label: 'login',
    route: '/login'
  },
  {
    label: 'profile',
    route: '/profile'
  },
  {
    label: 'updatepassword',
    route: '/updatepassword'
  },
  {
    label: 'changepassword',
    route: '/changepassword'
  }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title> Bpass Seidor</title>
      </head>
      <DataContextProvider>
        <body className={inter.className}>
          <header style={{ display: 'none' }}>
            <nav>
              <ul>
                {links.map(({ label, route }) => (
                  <li key={route}>
                    <Link href={route}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          {children}
        </body>
      </DataContextProvider>
    </html>

  );
}

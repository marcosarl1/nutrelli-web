import './globals.css';

import {Poppins} from 'next/font/google'

const poppins = Poppins({
    subsets: ["latin"],
    weight: ['400', '700'],
    display: 'swap',
    fallback: ['system-ui', 'arial'],
});

export default function RootLayout({ children }) {
  return (
      <html lang="pt">
          <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Nutrelli</title>
          </head>
          <body className={poppins.className}>
              {children}
          </body>
      </html>
  );
}

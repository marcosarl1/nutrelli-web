import './globals.css';

import { Poppins } from 'next/font/google'

const poppins = Poppins({
    weight: '400',
    subsets: ["latin"],
    display:"swap",
})

export default function RootLayout({ children }) {
  return (
      <html lang="en" className={poppins.className}>
          <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Nutrelli</title>
          </head>
          <body>{children}
          </body>
      </html>
  );
}

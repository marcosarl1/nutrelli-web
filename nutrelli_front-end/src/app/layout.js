import './globals.css';

export default function RootLayout({ children }) {
  return (
      <html lang="pt">
          <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Nutrelli</title>
          </head>
          <body className="font-sans">
              {children}
          </body>
      </html>
  );
}

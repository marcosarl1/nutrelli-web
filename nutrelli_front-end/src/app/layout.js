import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css'

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>{children}
        </body>
      </html>
  );
}

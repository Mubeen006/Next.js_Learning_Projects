import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { CartProvider } from '../lib/cartContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp; 
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCart } from '../lib/cartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart } = useCart();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
      return;
    }
    
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [status, router, cart]);
  
  if (status === 'loading' || !session || cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Checkout | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </>
  );
} 
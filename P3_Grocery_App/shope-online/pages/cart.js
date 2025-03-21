import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCart } from '../lib/cartContext';
import { ShoppingBagIcon, XMarkIcon as XIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(false);
  }, []);
  
  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Shopping Cart | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <ShoppingBagIcon className="h-10 w-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/products" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cart.length})</h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row border-b pb-4">
                      <div className="sm:w-24 sm:h-24 mb-2 sm:mb-0 relative">
                        <Image
                          src={item.images[0] || '/images/product-placeholder.jpg'}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="rounded-md object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-4">
                        <div className="flex justify-between">
                          <Link href={`/products/${item._id}`} className="text-lg font-medium hover:text-green-600">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          ${item.price.toFixed(2)} / {item.unit}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-l-md bg-gray-100 border border-gray-300"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 text-center border-t border-b border-gray-300 focus:outline-none"
                            />
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-r-md bg-gray-100 border border-gray-300"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link href="/products" className="mt-6 inline-flex items-center text-green-600 hover:text-green-700">
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <span className="mr-2">Proceed to Checkout</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 
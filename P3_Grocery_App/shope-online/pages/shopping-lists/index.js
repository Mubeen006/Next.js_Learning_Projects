import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ShoppingLists() {
  const { data: session } = useSession();
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/shopping-lists');
      return;
    }
    
    fetchShoppingLists();
  }, [session, router]);
  
  const fetchShoppingLists = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/shopping-lists');
      setShoppingLists(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast.error('Failed to fetch shopping lists');
      setLoading(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Shopping Lists | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">Shopping Lists</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div>
            {shoppingLists.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <ShoppingCartIcon className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">You don't have any shopping lists yet</h2>
                <p className="text-gray-600 mb-6">Create a shopping list to easily manage your groceries.</p>
                <Link href="/shopping-lists/create" className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block">
                  Create Shopping List
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shoppingLists.map((list) => (
                  <div key={list._id} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">{list.name}</h2>
                    
                    <p className="text-gray-600 mb-4">{list.items.length} items</p>
                    
                    <div className="flex justify-between items-center">
                      <Link href={`/shopping-lists/${list._id}`} className="text-green-600 hover:text-green-700">
                        View
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link href={`/shopping-lists/${list._id}/edit`} className="text-gray-600 hover:text-green-600">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        
                        <button className="text-gray-600 hover:text-red-500">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
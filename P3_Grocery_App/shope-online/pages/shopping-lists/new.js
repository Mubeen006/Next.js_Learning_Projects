import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ShoppingListForm from '../../components/shopping-list/ShoppingListForm';

export default function NewShoppingList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/shopping-lists/new');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <>
      <Head>
        <title>Create Shopping List | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">Create New Shopping List</h1>
        <ShoppingListForm />
      </div>
    </>
  );
}
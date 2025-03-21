import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/profile');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

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
        <title>Profile | Shope Online</title>
      </Head>

      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Account Type</p>
                  <p className="font-medium capitalize">{session.user.role || 'Customer'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/orders" className="text-green-600 hover:text-green-700 block">
                  Order History
                </Link>
                <Link href="/shopping-lists" className="text-green-600 hover:text-green-700 block">
                  Shopping Lists
                </Link>
                <Link href="/profile/edit" className="text-green-600 hover:text-green-700 block">
                  Edit Profile
                </Link>
                <Link href="/profile/change-password" className="text-green-600 hover:text-green-700 block">
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Addresses</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't added any addresses yet.</p>
            <Link href="/profile/addresses/add" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add Address
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 
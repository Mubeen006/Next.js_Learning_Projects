import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);
  
  return (
    <>
      <Head>
        <title>Sign In | Shope Online</title>
      </Head>
      
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Sign In to Your Account</h1>
        <LoginForm />
      </div>
    </>
  );
} 
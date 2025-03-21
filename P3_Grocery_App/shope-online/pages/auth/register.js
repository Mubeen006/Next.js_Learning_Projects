import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
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
        <title>Create Account | Shope Online</title>
      </Head>
      
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Create an Account</h1>
        <RegisterForm />
      </div>
    </>
  );
} 
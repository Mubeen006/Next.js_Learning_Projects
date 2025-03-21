import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would make an API call to send a reset email
      // await axios.post('/api/auth/forgot-password', { email });
      
      setSent(true);
      toast.success('If your email exists in our system, you will receive a password reset link.');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | Shope Online</title>
      </Head>
      
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Reset Your Password</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          {sent ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                If an account exists with the email you provided, we've sent instructions to reset your password.
              </p>
              <Link href="/auth/login" className="text-green-600 hover:text-green-700">
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Enter your email address below and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <Link href="/auth/login" className="text-green-600 hover:text-green-700">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 
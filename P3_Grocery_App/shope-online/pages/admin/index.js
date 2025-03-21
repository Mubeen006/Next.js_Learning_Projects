import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UsersIcon,
  ShoppingBagIcon,
  CubeIcon,
  TruckIcon,
  BanknotesIcon as CashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
        toast.error('You do not have permission to access this page');
        return;
      }
      
      fetchStats();
    }
  }, [status, session, router]);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
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
        <title>Admin Dashboard | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              <p className="text-sm text-orange-500">{stats.pendingOrders} pending</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <CubeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
              <p className="text-sm text-red-500">{stats.lowStockProducts} low stock</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <CashIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <TruckIcon className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500">Deliveries Today</p>
              <h3 className="text-2xl font-bold">{stats.deliveriesToday || 0}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">{stats.conversionRate || 0}%</h3>
            </div>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50"
          >
            <ShoppingBagIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Manage Orders</span>
          </button>
          
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50"
          >
            <CubeIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Manage Products</span>
          </button>
          
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50"
          >
            <UsersIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
            <span className="font-medium">Manage Users</span>
          </button>
        </div>
      </div>
    </>
  );
}
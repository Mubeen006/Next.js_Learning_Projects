import dbConnect from '../../../lib/db';
import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { method } = req;
  
  // Check user authentication and authorization
  const session = await getSession({ req });
  
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  await dbConnect();
  
  if (method === 'GET') {
    try {
      // Get total orders
      const totalOrders = await Order.countDocuments();
      
      // Get pending orders
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      
      // Get total products
      const totalProducts = await Product.countDocuments();
      
      // Get low stock products
      const lowStockProducts = await Product.countDocuments({ stockQuantity: { $lt: 10 } });
      
      // Get low stock products data
      const lowStockProductsData = await Product.find({ stockQuantity: { $lt: 10 } })
        .populate('category')
        .sort({ stockQuantity: 1 })
        .limit(5)
        .lean();
      
      // Get total users
      const totalUsers = await User.countDocuments();
      
      // Get total revenue
      const orders = await Order.find({ isPaid: true });
      const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      
      // Get recent orders
      const recentOrders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      
      // Get deliveries for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const deliveriesToday = await Order.countDocuments({
        status: 'shipped',
        estimatedDeliveryTime: { $gte: today, $lt: tomorrow }
      });
      
      // Convert MongoDB documents to plain objects and handle _id
      const formattedLowStockProducts = lowStockProductsData.map(product => ({
        ...product,
        _id: product._id.toString(),
        category: {
          ...product.category,
          _id: product.category._id.toString(),
        },
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString(),
      }));
      
      const formattedRecentOrders = recentOrders.map(order => ({
        ...order,
        _id: order._id.toString(),
        user: {
          ...order.user,
          _id: order.user._id.toString(),
        },
        createdAt: order.createdAt.toString(),
        updatedAt: order.updatedAt.toString(),
      }));
      
      res.status(200).json({
        success: true,
        data: {
          totalOrders,
          pendingOrders,
          totalProducts,
          lowStockProducts,
          totalUsers,
          totalRevenue,
          deliveriesToday,
          conversionRate: Math.round((totalOrders / totalUsers) * 100),
          lowStockProductsData: formattedLowStockProducts,
          recentOrders: formattedRecentOrders,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid method' });
  }
} 
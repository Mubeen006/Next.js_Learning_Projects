import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();
  
  // Get user session
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const userId = session.user.id;
  
  switch (method) {
    case 'GET':
      try {
        // For admin, return all orders
        if (session.user.role === 'admin') {
          const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('deliveryPerson', 'name email')
            .sort({ createdAt: -1 });
            
          return res.status(200).json({ success: true, data: orders });
        }
        
        // For delivery personnel, return assigned orders
        if (session.user.role === 'delivery') {
          const orders = await Order.find({ deliveryPerson: userId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
          return res.status(200).json({ success: true, data: orders });
        }
        
        // For regular users, return own orders
        const orders = await Order.find({ user: userId })
          .sort({ createdAt: -1 });
          
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        const { items, shippingAddress, paymentMethod, totalPrice, deliveryFee, preferredDeliveryTime } = req.body;
        
        // Check stock availability
        for (const item of items) {
          const product = await Product.findById(item.product);
          
          if (!product) {
            return res.status(400).json({
              success: false,
              message: `Product ${item.name} not found`,
            });
          }
          
          if (product.stockQuantity < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough stock for ${product.name}. Available: ${product.stockQuantity}`,
            });
          }
          
          // Update stock
          product.stockQuantity -= item.quantity;
          await product.save();
        }
        
        // Create order
        const order = await Order.create({
          user: userId,
          items,
          shippingAddress,
          paymentMethod,
          totalPrice,
          deliveryFee,
          preferredDeliveryTime: preferredDeliveryTime ? new Date(preferredDeliveryTime) : null,
          estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        });
        
        res.status(201).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
} 
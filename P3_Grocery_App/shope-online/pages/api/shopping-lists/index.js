import dbConnect from '../../../lib/db';
import ShoppingList from '../../../models/ShoppingList';
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
        const shoppingLists = await ShoppingList.find({ user: userId })
          .populate({
            path: 'items.product',
            model: 'Product',
          });
          
        res.status(200).json({ success: true, data: shoppingLists });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'POST':
      try {
        const { name, items, isDefault } = req.body;
        
        const shoppingList = await ShoppingList.create({
          user: userId,
          name,
          items,
          isDefault,
        });
        
        res.status(201).json({ success: true, data: shoppingList });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
} 
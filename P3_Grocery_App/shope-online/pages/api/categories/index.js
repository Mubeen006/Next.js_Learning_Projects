import dbConnect from '../../../lib/db';
import Category from '../../../models/Category';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { method } = req;
  
  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error connecting to database',
      error: error.message 
    });
  }

  switch (method) {
    case 'GET':
      try {
        console.log('Fetching categories');
        const categories = await Category.find({}).lean();
        
        // Convert Mongoose documents to plain objects with string IDs
        const formattedCategories = categories.map(category => ({
          ...category,
          _id: category._id.toString(),
          createdAt: category.createdAt ? category.createdAt.toString() : null,
          updatedAt: category.updatedAt ? category.updatedAt.toString() : null,
        }));
          
        res.status(200).json({ success: true, data: formattedCategories });
      } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error fetching categories',
          error: error.message 
        });
      }
      break;
      
    case 'POST':
      try {
        const session = await getSession({ req });
        
        if (!session || session.user.role !== 'admin') {
          return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized' 
          });
        }
        
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
      } catch (error) {
        console.error('Error creating category:', error);
        res.status(400).json({ 
          success: false, 
          message: 'Error creating category',
          error: error.message 
        });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
} 
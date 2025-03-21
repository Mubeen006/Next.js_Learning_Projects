import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
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
        const { category, search, minPrice, maxPrice, sort, limit } = req.query;
        
        let query = {};
        
        // Category filter
        if (category) {
          query.category = category;
        }
        
        // Search filter
        if (search) {
          query.name = { $regex: search, $options: 'i' };
        }
        
        // Price filter
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = parseFloat(minPrice);
          if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        
        // Build sort options
        let sortOptions = {};
        if (sort === 'price-asc') {
          sortOptions = { price: 1 };
        } else if (sort === 'price-desc') {
          sortOptions = { price: -1 };
        } else if (sort === 'newest') {
          sortOptions = { createdAt: -1 };
        } else if (sort === 'popular') {
          sortOptions = { isPopular: -1, createdAt: -1 };
        } else {
          // Default sort
          sortOptions = { createdAt: -1 };
        }
        
        // Apply limit if provided
        const limitNum = limit ? parseInt(limit) : 50;
        
        console.log('Fetching products with query:', { query, sortOptions, limitNum });
        
        const productsQuery = Product.find(query)
          .populate('category')
          .sort(sortOptions)
          .limit(limitNum);
          
        const products = await productsQuery.lean();
        
        // Convert Mongoose documents to plain objects with string IDs
        const formattedProducts = products.map(product => ({
          ...product,
          _id: product._id.toString(),
          category: product.category ? {
            ...product.category,
            _id: product.category._id.toString(),
            createdAt: product.category.createdAt ? product.category.createdAt.toString() : null,
            updatedAt: product.category.updatedAt ? product.category.updatedAt.toString() : null,
          } : null,
          createdAt: product.createdAt ? product.createdAt.toString() : null,
          updatedAt: product.updatedAt ? product.updatedAt.toString() : null,
        }));
          
        res.status(200).json({ success: true, data: formattedProducts });
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error fetching products',
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
        
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ 
          success: false, 
          message: 'Error creating product',
          error: error.message 
        });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
} 
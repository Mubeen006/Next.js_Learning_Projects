import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProductList from '../../components/products/ProductList';

export default function Products({ initialProducts = [], error = null }) {
  const router = useRouter();
  const { query } = router;
  
  return (
    <>
      <Head>
        <title>Products | Shope Online</title>
      </Head>
      
      <div>
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
            {error}
          </div>
        ) : (
          <ProductList 
            initialProducts={initialProducts} 
            initialCategory={query.category} 
            initialSearch={query.search} 
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  try {
    // Import dependencies only on the server side
    const dbConnect = (await import('../../lib/db')).default;
    const Product = (await import('../../models/Product')).default;
    
    await dbConnect();
    
    let queryObj = {};
    
    // Apply filters from query parameters
    if (query.category) {
      queryObj.category = query.category;
    }
    
    if (query.search) {
      queryObj.name = { $regex: query.search, $options: 'i' };
    }
    
    if (query.minPrice || query.maxPrice) {
      queryObj.price = {};
      if (query.minPrice) queryObj.price.$gte = parseFloat(query.minPrice);
      if (query.maxPrice) queryObj.price.$lte = parseFloat(query.maxPrice);
    }
    
    // Build sort options
    let sortOptions = {};
    if (query.sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (query.sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (query.sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (query.sort === 'popular') {
      sortOptions = { isPopular: -1, createdAt: -1 };
    } else {
      // Default sorting
      sortOptions = { createdAt: -1 };
    }
    
    // Fetch products
    const productsData = await Product.find(queryObj)
      .populate('category')
      .sort(sortOptions)
      .lean();
    
    // Convert MongoDB documents to plain objects and handle _id
    const initialProducts = productsData.map(product => ({
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
    
    return {
      props: {
        initialProducts,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialProducts: [],
        error: 'Failed to load products. Please try again later.'
      },
    };
  }
} 
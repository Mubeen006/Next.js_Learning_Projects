import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';

export default function Home({ featuredProducts = [], categories = [], serverError = null }) {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products?sort=popular&limit=8');
        if (res.data.success && Array.isArray(res.data.data)) {
          setPopularProducts(res.data.data);
          setError(null);
        } else {
          console.error('Invalid response format:', res.data);
          setError('Invalid response from server');
          setPopularProducts([]);
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
        setError(error.response?.data?.message || 'Failed to load popular products');
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularProducts();
  }, []);
  
  return (
    <div>
      {serverError && (
        <div className="bg-red-50 p-4 rounded-md text-red-500 mb-6">
          {serverError}
        </div>
      )}
  
      {/* Hero Section */}
      <div className="relative bg-green-600 rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="Fresh groceries" 
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 py-16 px-8 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Fresh Groceries Delivered to Your Door
            </h1>
            <p className="text-lg mb-8">
              Shop for fresh produce, pantry essentials, and more with convenient delivery to your home.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/products" className="btn bg-white text-green-600 hover:bg-gray-100 py-3 px-6 rounded-md font-bold text-center">
                Shop Now
              </Link>
              <Link href="/shopping-lists/new" className="btn border-2 border-white text-white hover:bg-white hover:text-green-600 py-3 px-6 rounded-md font-bold text-center">
                Create Shopping List
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link href="/categories" className="text-green-600 hover:text-green-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories && categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts && featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Popular Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Right Now</h2>
          <Link href="/products?sort=popular" className="text-green-600 hover:text-green-700 font-medium">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading popular products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts && popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No popular products found</p>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Features Section */}
      <section className="mb-12 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Shope Online?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Fast Delivery</h3>
            <p className="text-gray-600">Get your groceries delivered in as fast as 1 hour.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Fresh Produce</h3>
            <p className="text-gray-600">We source our products from local farmers and suppliers.</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Easy Shopping</h3>
            <p className="text-gray-600">Browse our wide selection of products and shop with ease.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add getStaticProps to fetch data at build time
export async function getStaticProps() {
  try {
    // Import dependencies only on the server side
    const dbConnect = (await import('../lib/db')).default;
    const Product = (await import('../models/Product')).default;
    const Category = (await import('../models/Category')).default;
    
    await dbConnect();
    
    // Fetch featured products
    const featuredProductsData = await Product.find({ isFeatured: true })
      .populate('category')
      .limit(8)
      .lean();
    
    // Fetch categories
    const categoriesData = await Category.find({}).limit(6).lean();
    
    // Convert MongoDB documents to plain objects
    const featuredProducts = featuredProductsData.map(product => ({
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
    
    const categories = categoriesData.map(category => ({
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt ? category.createdAt.toString() : null,
      updatedAt: category.updatedAt ? category.updatedAt.toString() : null,
    }));
    
    return {
      props: {
        featuredProducts,
        categories,
      },
      revalidate: 60, // Regenerate the page every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Return empty data on error
    return {
      props: {
        featuredProducts: [],
        categories: [],
        serverError: 'Failed to load featured products and categories. Please refresh the page.'
      },
      revalidate: 10, // Try again sooner if there was an error
    };
  }
}
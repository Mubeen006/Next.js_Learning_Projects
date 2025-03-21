import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useCart } from '../../lib/cartContext';
import { HeartIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import ProductCard from '../../components/products/ProductCard';

export default function ProductDetail({ product, relatedProducts }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  const toggleFavorite = () => {
    if (!session) {
      toast.info('Please sign in to save favorites');
      return;
    }
    
    setFavorite(!favorite);
    if (!favorite) {
      toast.success(`${product.name} added to favorites!`);
    } else {
      toast.info(`${product.name} removed from favorites!`);
    }
  };
  
  // Calculate discount price if there's a discount
  const discountPrice = product.discountPercentage 
    ? (product.price - (product.price * product.discountPercentage / 100)).toFixed(2) 
    : null;
  
  return (
    <>
      <Head>
        <title>{product.name} | Shope Online</title>
        <meta name="description" content={product.description} />
      </Head>
      
      <div>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/products" className="hover:text-green-600 flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${product.category._id}`} className="hover:text-green-600">
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 w-full mb-4 relative rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || '/images/product-placeholder.jpg'}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-green-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full relative">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={`h-5 w-5 ${
                      rating <= 4 ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">(42 reviews)</span>
            </div>
            
            <div className="mb-4">
              {discountPrice ? (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600">${discountPrice}</span>
                  <span className="ml-2 text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="ml-1 text-gray-500">/ {product.unit}</span>
                </div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                  <span className="ml-1 text-gray-500">/ {product.unit}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="text-gray-700 font-medium">Availability:</span>
                {product.stockQuantity > 10 ? (
                  <span className="ml-2 text-green-600">In Stock</span>
                ) : product.stockQuantity > 0 ? (
                  <span className="ml-2 text-orange-500">Low Stock - Only {product.stockQuantity} left</span>
                ) : (
                  <span className="ml-2 text-red-500">Out of Stock</span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-700 font-medium">Category:</span>
                <Link href={`/categories/${product.category._id}`} className="ml-2 text-green-600 hover:text-green-700">
                  {product.category.name}
                </Link>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-l-md bg-gray-100 border border-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stockQuantity}
                  className="w-10 h-10 flex items-center justify-center rounded-r-md bg-gray-100 border border-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center ${
                  product.stockQuantity === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              
              <button
                onClick={toggleFavorite}
                className="flex-1 py-3 px-6 rounded-md border-2 border-gray-300 hover:border-green-600 flex items-center justify-center"
              >
                {favorite ? (
                  <HeartIconSolid className="h-5 w-5 mr-2 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 mr-2" />
                )}
                {favorite ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  await dbConnect();
  
  // Get all product IDs
  const products = await Product.find({}, '_id').limit(20).lean();
  
  const paths = products.map((product) => ({
    params: { id: product._id.toString() },
  }));
  
  return {
    paths,
    fallback: true, // Generate additional pages on demand
  };
}

export async function getStaticProps({ params }) {
  await dbConnect();
  
  try {
    // Fetch the product by ID
    const productData = await Product.findById(params.id).populate('category').lean();
    
    if (!productData) {
      return {
        notFound: true,
      };
    }
    
    // Convert MongoDB document to plain object and handle _id
    const product = {
      ...productData,
      _id: productData._id.toString(),
      category: {
        ...productData.category,
        _id: productData.category._id.toString(),
      },
      createdAt: productData.createdAt.toString(),
      updatedAt: productData.updatedAt.toString(),
    };
    
    // Fetch related products in the same category
    const relatedProductsData = await Product.find({
      category: productData.category._id,
      _id: { $ne: productData._id }, // Exclude current product
    })
      .populate('category')
      .limit(4)
      .lean();
    
    // Convert MongoDB documents to plain objects and handle _id
    const relatedProducts = relatedProductsData.map((product) => ({
      ...product,
      _id: product._id.toString(),
      category: {
        ...product.category,
        _id: product.category._id.toString(),
      },
      createdAt: product.createdAt.toString(),
      updatedAt: product.updatedAt.toString(),
    }));
    
    return {
      props: {
        product,
        relatedProducts,
      },
      revalidate: 60, // Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps for product detail:', error);
    return {
      notFound: true,
    };
  }
} 
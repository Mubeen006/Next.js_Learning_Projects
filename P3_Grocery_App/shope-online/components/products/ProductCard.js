import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../lib/cartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const [favorite, setFavorite] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  const toggleFavorite = () => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <Link href={`/products/${product._id}`}>
          <div className="aspect-w-1 aspect-h-1 w-full">
            <Image
              src={product.images[0] || '/images/product-placeholder.jpg'}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-300 hover:opacity-90"
            />
          </div>
        </Link>
        
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm"
        >
          {favorite ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </button>
        
        {/* Discount badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product._id}`} className="text-lg font-medium text-gray-800 hover:text-green-600 truncate">
          {product.name}
        </Link>
        
        <p className="text-sm text-gray-600 mt-1 truncate">
          {product.category.name}
        </p>
        
        <div className="mt-2 flex items-center">
          {discountPrice ? (
            <>
              <span className="text-lg font-bold text-green-600">${discountPrice}</span>
              <span className="ml-2 text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
          )}
          <span className="ml-1 text-sm text-gray-500">/ {product.unit}</span>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {product.stockQuantity > 10 ? (
              <span className="text-green-600">In Stock</span>
            ) : product.stockQuantity > 0 ? (
              <span className="text-orange-500">Low Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded ${
              product.stockQuantity === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
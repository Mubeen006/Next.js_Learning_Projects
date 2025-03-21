import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function OrderItem({ order }) {
  const [expanded, setExpanded] = useState(false);
  
  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format delivery time
  const formatDeliveryTime = (dateStr) => {
    if (!dateStr) return 'Not specified';
    
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Order #{order._id.substring(order._id.length - 6)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Placed on {format(new Date(order.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center">
          <span className="mr-4 font-medium">${order.totalPrice.toFixed(2)}</span>
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Items</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <img
                        src={item.image || '/images/product-placeholder.jpg'}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <address className="not-italic text-gray-600">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Order Info</h4>
              <p className="text-gray-600">
                <span className="font-medium">Payment Method:</span>{' '}
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Payment Status:</span>{' '}
                {order.isPaid ? 'Paid' : 'Not Paid'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Preferred Delivery:</span>{' '}
                {formatDeliveryTime(order.preferredDeliveryTime)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Estimated Delivery:</span>{' '}
                {formatDeliveryTime(order.estimatedDeliveryTime)}
              </p>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${(order.totalPrice - order.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <Link href={`/orders/${order._id}`} className="text-green-600 hover:text-green-700 font-medium">
              View Details
            </Link>
            
            {order.status === 'pending' && (
              <button className="text-red-600 hover:text-red-700 font-medium">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
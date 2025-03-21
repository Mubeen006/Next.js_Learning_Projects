import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../../lib/cartContext';

export default function CheckoutForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart, totalPrice } = useCart();
  
  // Default to user's address from profile if available
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryFee, setDeliveryFee] = useState(5.99);
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  
  // Get available delivery time slots
  const getDeliveryTimeSlots = () => {
    const today = new Date();
    const slots = [];
    
    // Add slots for the next 3 days
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Format date as YYYY-MM-DD
      const dateStr = date.toISOString().split('T')[0];
      
      // Add time slots (9am to 7pm, 2-hour intervals)
      for (let hour = 9; hour <= 19; hour += 2) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const slot = `${dateStr}T${timeStr}:00`;
        slots.push(slot);
      }
    }
    
    return slots;
  };
  
  const deliveryTimeSlots = getDeliveryTimeSlots();
  
  // Fetch user info to pre-fill address
  useEffect(() => {
    if (session) {
      fetchUserInfo();
    }
  }, [session]);
  
  const fetchUserInfo = async () => {
    setLoadingUserInfo(true);
    try {
      const res = await axios.get('/api/profile');
      const user = res.data.data;
      
      if (user.address) {
        setShippingAddress(user.address);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoadingUserInfo(false);
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      
      // Format items for the order
      const items = cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images[0],
      }));
      
      // Create the order
      const res = await axios.post('/api/orders', {
        items,
        shippingAddress,
        paymentMethod,
        totalPrice: totalPrice + deliveryFee,
        deliveryFee,
        preferredDeliveryTime: preferredDeliveryTime ? new Date(preferredDeliveryTime).toISOString() : null,
      });
      
      const orderId = res.data.data._id;
      
      // If payment method is card, redirect to payment page
      if (paymentMethod === 'card') {
        router.push(`/payment/${orderId}`);
      } else {
        // For cash on delivery, just go to confirmation
        clearCart();
        router.push(`/orders/${orderId}/confirmation`);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingUserInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
                Street Address
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                  State/Province
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                  Zip/Postal Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Delivery Options */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Delivery Options</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryTime">
              Preferred Delivery Time
            </label>
            <select
              id="deliveryTime"
              value={preferredDeliveryTime}
              onChange={(e) => setPreferredDeliveryTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a delivery time</option>
              {deliveryTimeSlots.map((slot) => {
                const date = new Date(slot);
                const formattedDate = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                return (
                  <option key={slot} value={slot}>
                    {formattedDate} at {formattedTime}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Payment Method</h3>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">PayPal</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">Cash on Delivery</span>
            </label>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="mb-6 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-2 mt-2 border-gray-300 flex justify-between font-bold">
              <span>Total</span>
              <span>${(totalPrice + deliveryFee).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
} 
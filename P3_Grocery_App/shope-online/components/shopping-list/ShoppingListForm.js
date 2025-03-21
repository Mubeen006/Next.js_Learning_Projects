import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ShoppingListForm({ initialData = null }) {
  const router = useRouter();
  const isEditing = !!initialData;
  
  const [name, setName] = useState(initialData?.name || '');
  const [items, setItems] = useState(initialData?.items || []);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const searchProducts = async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const res = await axios.get(`/api/products?search=${term}&limit=5`);
      setSearchResults(res.data.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowResults(true);
    searchProducts(term);
  };
  
  const addItem = (product) => {
    const existingItem = items.find(item => item.product._id === product._id);
    
    if (existingItem) {
      setItems(items.map(item => 
        item.product._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { product, quantity: 1 }]);
    }
    
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  const removeItem = (productId) => {
    setItems(items.filter(item => item.product._id !== productId));
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(items.map(item => 
      item.product._id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Please enter a name for your shopping list');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Please add at least one item to your shopping list');
      return;
    }
    
    try {
      setLoading(true);
      
      const formattedItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      
      if (isEditing) {
        await axios.put(`/api/shopping-lists/${initialData._id}`, {
          name,
          items: formattedItems,
          isDefault,
        });
        toast.success('Shopping list updated successfully!');
      } else {
        await axios.post('/api/shopping-lists', {
          name,
          items: formattedItems,
          isDefault,
        });
        toast.success('Shopping list created successfully!');
      }
      
      router.push('/shopping-lists');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Edit Shopping List' : 'Create New Shopping List'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            List Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekly Groceries"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700">Make this my default shopping list</span>
          </label>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Add Items
          </label>
          
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setShowResults(true)}
              placeholder="Search for products to add..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(product => (
                  <div
                    key={product._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => addItem(product)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)} / {product.unit}</p>
                    </div>
                    <PlusCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border border-gray-300 rounded-md divide-y">
            {items.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No items added yet. Search and add products above.
              </div>
            ) : (
              items.map(item => (
                <div key={item.product._id} className="p-3 flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.product.price.toFixed(2)} / {item.product.unit}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                      className="w-12 px-2 py-1 text-center border border-gray-300 rounded-md"
                    />
                    
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Shopping List'}
        </button>
      </form>
    </div>
  );
}
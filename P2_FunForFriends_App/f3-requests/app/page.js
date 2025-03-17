'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '@/components/UserCard';
import FilterPanel from '@/components/FilterPanel';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    option: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch requests
        const queryParams = new URLSearchParams();
        if (filters.gender) queryParams.append('gender', filters.gender);
        if (filters.minAge) queryParams.append('minAge', filters.minAge);
        if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
        if (filters.option) queryParams.append('option', filters.option);

        const requestsResponse = await fetch(`/api/requests?${queryParams.toString()}`);
        const requestsData = await requestsResponse.json();

        // Fetch favorites
        const favoritesResponse = await fetch('/api/favorites');
        const favoritesData = await favoritesResponse.json();

        // Handle different response formats
        const usersArray = requestsData.success && requestsData.data ? requestsData.data : requestsData;
        
        // Extract favorite IDs from response
        let favoriteIds = [];
        if (favoritesData.success && favoritesData.data) {
          // If response has success and data properties
          favoriteIds = favoritesData.data.map(fav => {
            // If userId is an object with _id property (populated)
            if (fav.userId && typeof fav.userId === 'object' && fav.userId._id) {
              return fav.userId._id;
            }
            // If userId is a string (not populated)
            return fav.userId;
          });
        } else if (Array.isArray(favoritesData)) {
          // If response is already an array of IDs
          favoriteIds = favoritesData;
        }

        setUsers(usersArray);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddToFavorites = async (userId) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(prev => [...prev, userId]);
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(data.error || 'Failed to add to favorites'));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return Promise.reject(error);
    }
  };

  const handleRemoveFromFavorites = async (userId) => {
    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setFavorites(prev => prev.filter(id => id !== userId));
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(data.error || 'Failed to remove from favorites'));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="animate-fade-in">
      {loading && <LoadingSpinner />}
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2 text-shadow-md">Browse Requests</h1>
            <p className="text-white/80 font-medium">Find and connect with people looking for friendship, relationship, or suggestions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              {/* We're using the LoadingSpinner component at the top of the page instead */}
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <div key={user._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <UserCard
                    user={user}
                    isFavorite={favorites.includes(user._id)}
                    onAddToFavorites={handleAddToFavorites}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-lg blur-sm"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md text-center border border-white/20">
                <h3 className="text-xl font-medium text-white mb-3 text-shadow-sm">No requests found</h3>
                <p className="text-white/80">Try adjusting your filters or check back later.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

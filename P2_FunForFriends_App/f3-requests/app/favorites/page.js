'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '@/components/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaHeart } from 'react-icons/fa';

export default function FavoritesPage() {
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        // Fetch favorite IDs
        const favoritesResponse = await fetch('/api/favorites');
        const favoritesData = await favoritesResponse.json();
        
        // Extract favorite IDs from response
        let favoriteIds = [];
        let favoriteRecords = [];
        if (favoritesData.success && favoritesData.data) {
          // If response has success and data properties
          favoriteRecords = favoritesData.data;
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
        
        if (favoriteIds.length === 0) {
          setFavoriteUsers([]);
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Fetch user details for each favorite
        const usersResponse = await fetch('/api/requests');
        const usersData = await usersResponse.json();
        
        // Handle different response formats
        const allUsers = usersData.success && usersData.data ? usersData.data : usersData;
        
        // Filter users to only include favorites
        const favoriteUsersList = allUsers.filter(user => 
          favoriteIds.includes(user._id)
        );
        
        // Add favorite record ID to each user object
        const enhancedFavoriteUsers = favoriteUsersList.map(user => {
          const favoriteRecord = favoriteRecords.find(fav => 
            (fav.userId === user._id) || 
            (fav.userId && fav.userId._id === user._id)
          );
          return {
            ...user,
            favoriteRecordId: favoriteRecord ? favoriteRecord._id : null
          };
        });
        
        setFavoriteUsers(enhancedFavoriteUsers);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (userId) => {
    try {
      const response = await fetch(`/api/favorites/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Update both states
        setFavorites(prev => prev.filter(id => id !== userId));
        setFavoriteUsers(prev => prev.filter(user => user._id !== userId));
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(data.error || 'Failed to remove from favorites'));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return Promise.reject(error);
    }
  };

  // This is a no-op since we're already in favorites
  const handleAddToFavorites = async () => {
    return Promise.resolve();
  };

  return (
    <div className="animate-fade-in">
      {loading && <LoadingSpinner />}
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2 text-shadow-md flex items-center">
              <FaHeart className="text-pink-400 mr-3" /> Your Favorites
            </h1>
            <p className="text-white/80 font-medium">People you've marked as favorites will appear here. You can set reminders for your favorites.</p>
          </div>
        </div>
      </div>

      {!loading && (
        <>
          {favoriteUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteUsers.map((user, index) => (
                <div key={user._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <UserCard
                    user={user}
                    isFavorite={true}
                    onAddToFavorites={handleAddToFavorites}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                    showReminderButton={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-lg blur-sm"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md text-center border border-white/20">
                <h3 className="text-xl font-medium text-white mb-3 text-shadow-sm">No favorites yet</h3>
                <p className="text-white/80 mb-6">You haven't added any favorites yet. Browse requests and click the heart icon to add favorites.</p>
                <a 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Browse Requests
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
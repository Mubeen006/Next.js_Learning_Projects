'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaGraduationCap, FaHeart as FaHeartPassion, FaMusic, FaImage, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { isCloudinaryUrl, optimizeCloudinaryUrl } from '@/lib/imageUtils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useParams } from 'next/navigation';

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/requests/${id}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        // Fetch favorites to check if this user is favorited
        const favoritesResponse = await fetch('/api/favorites');
        if (!favoritesResponse.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const favoritesData = await favoritesResponse.json();
        
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
        
        // Handle different response formats
        const userObject = userData.success && userData.data ? userData.data : userData;
        
        setUser(userObject);
        setIsFavorite(favoriteIds.includes(id));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(false);
          toast.success('Removed from favorites');
        } else {
          throw new Error(data.error || 'Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: id }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(true);
          toast.success('Added to favorites');
        } else {
          throw new Error(data.error || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  // Format gender for display
  const formatGender = (gender) => {
    return gender === 'Munda' ? 'Male' : gender === 'Kudii' ? 'Female' : gender;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Optimize image URL if it's from Cloudinary
  const getOptimizedImageUrl = (url) => {
    if (isCloudinaryUrl(url)) {
      return optimizeCloudinaryUrl(url, { 
        width: 800, 
        height: 600, 
        quality: 'auto',
        fetchFormat: true
      });
    }
    return url;
  };

  // Get background gradient based on option type
  const getOptionBackground = (type) => {
    switch (type) {
      case 'friendship':
        return 'from-blue-600/30 to-blue-400/30';
      case 'relationship':
        return 'from-pink-600/30 to-pink-400/30';
      case 'suggestions':
        return 'from-purple-600/30 to-purple-400/30';
      default:
        return 'from-purple-500/30 to-pink-500/30';
    }
  };

  // Get color for option type tag
  const getOptionTypeColor = (type) => {
    switch (type) {
      case 'friendship':
        return 'bg-blue-500/50 text-white border border-blue-300/50';
      case 'relationship':
        return 'bg-pink-500/50 text-white border border-pink-300/50';
      case 'suggestions':
        return 'bg-purple-500/50 text-white border border-purple-300/50';
      default:
        return 'bg-gray-500/50 text-white border border-gray-300/50';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-lg blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md text-center border border-white/20">
            <h3 className="text-xl font-medium text-white mb-3 text-shadow-sm">User not found</h3>
            <p className="text-white/80 mb-6">The user you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md shadow-md transition-all duration-200 backdrop-blur-sm"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Image and basic info */}
        <div className="md:col-span-1">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-md rounded-lg shadow-md overflow-hidden border border-white/20">
              <div className={`relative h-80 overflow-hidden bg-gradient-to-br ${getOptionBackground(user.option)}`}>
                {user.image && !imageError ? (
                  <Image 
                    src={getOptimizedImageUrl(user.image)} 
                    alt={user.name} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={handleImageError}
                    priority
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${user.option === 'friendship' ? 'from-blue-800/50 to-blue-600/50' : 
                                                                    user.option === 'relationship' ? 'from-pink-800/50 to-pink-600/50' : 
                                                                    user.option === 'suggestions' ? 'from-purple-800/50 to-purple-600/50' : 
                                                                    'from-purple-800/50 to-pink-800/50'} flex items-center justify-center`}>
                    <FaImage className="text-white/50 w-16 h-16 animate-pulse-slow" />
                  </div>
                )}
                
                {/* Add gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                
                {/* Option tag */}
                {user.option && (
                  <div className="absolute top-4 left-4">
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg ${getOptionTypeColor(user.option)} transition-all duration-200`}
                    >
                      {user.option.charAt(0).toUpperCase() + user.option.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1 text-shadow-md">
                      {user.name}
                    </h1>
                    <p className="text-white/80 font-medium">
                      {user.age} years • {formatGender(user.gender)}
                    </p>
                  </div>
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${isFavorite ? 'bg-pink-500/70' : 'bg-white/20'}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <FaHeart className="w-6 h-6 text-white drop-shadow-md" />
                    ) : (
                      <FaRegHeart className="w-6 h-6 text-white drop-shadow-md" />
                    )}
                  </button>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center text-gray-300 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-lg" />
                    <span className="font-medium">{user.residence || 'Location not specified'}</span>
                  </div>
                  {user.education && (
                    <div className="flex items-center text-gray-300 mb-3">
                      <FaGraduationCap className="mr-2 text-lg" />
                      <span className="font-medium">{user.education} {user.educationProgram ? `(${user.educationProgram})` : ''}</span>
                    </div>
                  )}
                  {user.passion && (
                    <div className="flex items-center text-gray-300 mb-3">
                      <FaHeartPassion className="mr-2 text-lg text-pink-300" />
                      <span className="font-medium">{user.passion}</span>
                    </div>
                  )}
                  {user.hobbies && (
                    <div className="flex items-center text-gray-300 mb-3">
                      <FaMusic className="mr-2 text-lg text-purple-300" />
                      <span className="font-medium">{user.hobbies}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Detailed information */}
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 text-shadow-sm">About {user.name}</h2>
              
              {(user.reason || user.loveReason) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {user.option === 'relationship' ? 'Looking for Love' : 'Reason for Request'}
                  </h3>
                  <p className="text-white/90 font-medium bg-white/5 p-4 rounded-lg border border-white/10">
                    {user.reason || user.loveReason}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Additional information */}
                {user.option && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Looking For</h3>
                    <p className={`text-white/90 bg-white/5 p-3 rounded-lg border border-white/10 ${
                      user.option === 'friendship' ? 'text-blue-300' : 
                      user.option === 'relationship' ? 'text-pink-300' : 
                      user.option === 'suggestions' ? 'text-purple-300' : ''
                    }`}>
                      {user.option.charAt(0).toUpperCase() + user.option.slice(1)}
                    </p>
                  </div>
                )}
                
                {user.education && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Education</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.education}
                    </p>
                  </div>
                )}
                
                {user.educationProgram && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Education Program</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.educationProgram}
                    </p>
                  </div>
                )}
                
                {user.passion && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Passion</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.passion}
                    </p>
                  </div>
                )}
                
                {user.hobbies && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Hobbies</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.hobbies}
                    </p>
                  </div>
                )}
                
                {user.residence && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Location</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.residence}
                    </p>
                  </div>
                )}

                {user.advice && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Advice</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.advice}
                    </p>
                  </div>
                )}

                {user.number && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Contact Number</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {user.number}
                    </p>
                  </div>
                )}

                {user.createdAt && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Joined</h3>
                    <p className="text-white/90 bg-white/5 p-3 rounded-lg border border-white/10">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Contact button */}
              <div className="mt-8">
                <button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center shadow-md text-lg font-medium"
                  onClick={() => toast.success('Contact feature coming soon!')}
                >
                  <FaHeart className="mr-2" /> Connect with {user.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
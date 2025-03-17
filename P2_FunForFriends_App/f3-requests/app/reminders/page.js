'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaTrash, FaCalendarAlt, FaClock, FaCheck, FaUser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        // Fetch reminders
        const remindersResponse = await fetch('/api/reminders');
        const remindersData = await remindersResponse.json();
        
        let remindersList = [];
        if (remindersData.success && remindersData.data) {
          remindersList = remindersData.data;
        } else if (Array.isArray(remindersData)) {
          remindersList = remindersData;
        }
        
        // Fetch all users to get user details
        const usersResponse = await fetch('/api/requests');
        const usersData = await usersResponse.json();
        
        // Handle different response formats
        const allUsers = usersData.success && usersData.data ? usersData.data : usersData;
        
        // Create a map of user IDs to user objects for quick lookup
        const usersMap = {};
        if (Array.isArray(allUsers)) {
          allUsers.forEach(user => {
            usersMap[user._id] = user;
          });
        }
        
        // Fetch favorites to get additional user data
        const favoritesResponse = await fetch('/api/favorites');
        const favoritesData = await favoritesResponse.json();
        const favorites = favoritesData.success && favoritesData.data ? favoritesData.data : 
                         Array.isArray(favoritesData) ? favoritesData : [];
        
        // Add favorite users to the users map
        if (Array.isArray(favorites)) {
          favorites.forEach(favorite => {
            if (favorite.user && favorite.user._id) {
              usersMap[favorite.user._id] = favorite.user;
            }
          });
        }
        
        setReminders(remindersList);
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast.error('Failed to load reminders');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleDeleteReminder = async (id) => {
    try {
      const response = await fetch(`/api/reminders?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setReminders(prev => prev.filter(reminder => reminder._id !== id));
        toast.success('Reminder deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  const handleMarkAsComplete = async (id) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isCompleted: true }),
      });

      const data = await response.json();

      if (data.success) {
        setReminders(prev => 
          prev.map(reminder => 
            reminder._id === id ? { ...reminder, isCompleted: true } : reminder
          )
        );
        toast.success('Reminder marked as complete');
      } else {
        toast.error(data.error || 'Failed to update reminder');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  const formatReminderDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatReminderTime = (dateString) => {
    try {
      return format(new Date(dateString), 'p');
    } catch (error) {
      return '';
    }
  };

  const isReminderOverdue = (dateString) => {
    try {
      const reminderDate = new Date(dateString);
      const now = new Date();
      return reminderDate < now;
    } catch (error) {
      return false;
    }
  };

  // Get user from reminder
  const getUserFromReminder = (reminder) => {
    // Try to get user from userId first
    if (reminder.userId && typeof reminder.userId === 'object' && reminder.userId._id) {
      return reminder.userId;
    }
    
    // Then try from userId as string
    if (reminder.userId && typeof reminder.userId === 'string' && users[reminder.userId]) {
      return users[reminder.userId];
    }
    
    // Then try from favoriteId if it's an object with user property
    if (reminder.favoriteId && typeof reminder.favoriteId === 'object' && reminder.favoriteId.user) {
      return reminder.favoriteId.user;
    }
    
    // Then try from favoriteId as string
    if (reminder.favoriteId && typeof reminder.favoriteId === 'string' && users[reminder.favoriteId]) {
      return users[reminder.favoriteId];
    }
    
    // Finally, try from our users map
    return users[reminder.userId] || users[reminder.favoriteId] || null;
  };

  // Navigate to user detail page
  const navigateToUserDetail = (userId, e) => {
    e.stopPropagation(); // Prevent other click handlers
    if (userId) {
      router.push(`/user/${userId}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {loading && <LoadingSpinner />}
      
      <div className="mb-8">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2 text-shadow-md flex items-center">
              <FaBell className="text-yellow-400 mr-3" /> Your Reminders
            </h1>
            <p className="text-white/80 font-medium">Keep track of your scheduled reminders for favorite users.</p>
          </div>
        </div>
      </div>

      {!loading && (
        <>
          {reminders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders.map((reminder) => {
                const user = getUserFromReminder(reminder);
                const isOverdue = isReminderOverdue(reminder.date);
                const userId = user?._id;
                
                return (
                  <div key={reminder._id} className="animate-fade-in">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-sm"></div>
                      <div className={`relative bg-white/10 backdrop-blur-md rounded-lg shadow-md overflow-hidden border ${reminder.isCompleted ? 'border-green-300/30' : isOverdue ? 'border-red-300/30' : 'border-white/20'}`}>
                        <div className={`h-2 ${reminder.isCompleted ? 'bg-green-500/50' : isOverdue ? 'bg-red-500/50' : 'bg-yellow-500/50'}`}></div>
                        
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            {userId ? (
                              <h3 
                                className="text-lg font-semibold text-white cursor-pointer hover:text-pink-300 transition-colors duration-200 flex items-center"
                                onClick={(e) => navigateToUserDetail(userId, e)}
                              >
                                <FaUser className="mr-2 text-pink-400" />
                                {user.name}
                              </h3>
                            ) : (
                              <h3 className="text-lg font-semibold text-white/70">
                                <FaUser className="mr-2 inline text-gray-400" />
                                Unknown User
                              </h3>
                            )}
                            <div className="flex space-x-2">
                              {!reminder.isCompleted && (
                                <button
                                  onClick={() => handleMarkAsComplete(reminder._id)}
                                  className="p-2 bg-green-500/30 hover:bg-green-500/50 text-white rounded-full transition-colors duration-200"
                                  aria-label="Mark as complete"
                                >
                                  <FaCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReminder(reminder._id)}
                                className="p-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded-full transition-colors duration-200"
                                aria-label="Delete reminder"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center text-gray-300 mb-2">
                              <FaCalendarAlt className="mr-2 text-yellow-300" />
                              <span>{formatReminderDate(reminder.date)}</span>
                            </div>
                            <div className="flex items-center text-gray-300">
                              <FaClock className="mr-2 text-yellow-300" />
                              <span>{formatReminderTime(reminder.date)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-white/90 font-medium">
                              {reminder.message || 'No message provided.'}
                            </p>
                          </div>
                          
                          {reminder.isCompleted ? (
                            <div className="mt-4 bg-green-500/20 text-white text-center py-1 px-2 rounded-md">
                              Completed
                            </div>
                          ) : isOverdue ? (
                            <div className="mt-4 bg-red-500/20 text-white text-center py-1 px-2 rounded-md">
                              Overdue
                            </div>
                          ) : (
                            <div className="mt-4 bg-yellow-500/20 text-white text-center py-1 px-2 rounded-md">
                              Upcoming
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 rounded-lg blur-sm"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-md text-center border border-white/20">
                <h3 className="text-xl font-medium text-white mb-3 text-shadow-sm">No reminders yet</h3>
                <p className="text-white/80 mb-6">You haven't set any reminders yet. Add reminders from your favorites page.</p>
                <a 
                  href="/favorites" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Go to Favorites
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
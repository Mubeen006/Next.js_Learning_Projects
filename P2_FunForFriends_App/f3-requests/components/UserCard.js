'use client';

import { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaGraduationCap, FaHeart as FaHeartPassion, FaMusic, FaImage, FaTimes, FaExpand, FaBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { gsap } from 'gsap';
import { pulseAnimation } from '@/lib/animations';
import { isCloudinaryUrl, optimizeCloudinaryUrl } from '@/lib/imageUtils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReminderModal from './ReminderModal';

const UserCard = ({ user, isFavorite = false, onAddToFavorites, onRemoveFromFavorites, showReminderButton = false }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const favoriteButtonRef = useRef(null);
  const reminderButtonRef = useRef(null);
  const tagRef = useRef(null);
  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const bioRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  // Initialize animations when component mounts
  useEffect(() => {
    // Initial card entrance animation
    gsap.fromTo(
      cardRef.current,
      { 
        y: 50, 
        opacity: 0,
        scale: 0.95
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.6, 
        ease: "power2.out"
      }
    );

    // Staggered content animation
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { 
          y: 20, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.4, 
          delay: 0.3,
          ease: "power1.out"
        }
      );
    }

    // Tag animation
    if (tagRef.current) {
      gsap.fromTo(
        tagRef.current,
        { 
          scale: 0, 
          opacity: 0 
        },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          delay: 0.7,
          ease: "back.out(1.7)"
        }
      );
    }

    // Name animation with text reveal effect
    if (nameRef.current) {
      const text = nameRef.current;
      gsap.fromTo(
        text,
        { 
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" 
        },
        { 
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.6,
          delay: 0.4
        }
      );
    }

    // Image animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { 
          scale: 1.1,
          opacity: 0
        },
        { 
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }

    // Modal animation when it opens
    if (isImageModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, [isImageModalOpen]);

  // Handle mouse enter animation
  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Subtle card scale and shadow animation
    gsap.to(cardRef.current, {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Image zoom effect
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.5,
        ease: "power1.out"
      });
    }
    
    // Favorite button animation
    if (favoriteButtonRef.current) {
      gsap.to(favoriteButtonRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });
    }
    
    // Location icon animation
    if (locationRef.current) {
      const icon = locationRef.current.querySelector('svg');
      if (icon) {
        gsap.to(icon, {
          y: -2,
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      }
    }
    
    // Bio section animation
    if (bioRef.current) {
      gsap.to(bioRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        duration: 0.3
      });
    }
  };

  // Handle mouse leave animation
  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Reset card scale and shadow
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      duration: 0.3,
      ease: "power2.out"
    });
    
    // Reset image zoom
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power1.out"
      });
    }
    
    // Reset favorite button
    if (favoriteButtonRef.current) {
      gsap.to(favoriteButtonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    // Reset location icon
    if (locationRef.current) {
      const icon = locationRef.current.querySelector('svg');
      if (icon) {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
    
    // Reset bio section
    if (bioRef.current) {
      gsap.to(bioRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        duration: 0.3
      });
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Animate heart before removing
        gsap.to(favoriteButtonRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: async () => {
            await onRemoveFromFavorites(user._id);
            gsap.to(favoriteButtonRef.current, {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "back.out(1.7)"
            });
          }
        });
      } else {
        // Animate heart when adding
        gsap.to(favoriteButtonRef.current, {
          scale: 1.3,
          duration: 0.4,
          ease: "elastic.out(1, 0.3)",
          onComplete: async () => {
            await onAddToFavorites(user._id);
            pulseAnimation(favoriteButtonRef.current);
          }
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
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

  // Format gender for display
  const formatGender = (gender) => {
    return gender === 'Munda' ? 'Male' : gender === 'Kudii' ? 'Female' : gender;
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Optimize image URL if it's from Cloudinary
  const getOptimizedImageUrl = (url) => {
    if (isCloudinaryUrl(url)) {
      return optimizeCloudinaryUrl(url, { 
        width: 400, 
        height: 300, 
        quality: 'auto',
        fetchFormat: true
      });
    }
    return url;
  };

  // Get high quality image for modal
  const getHighQualityImageUrl = (url) => {
    if (isCloudinaryUrl(url)) {
      return optimizeCloudinaryUrl(url, { 
        width: 1200, 
        height: 900, 
        quality: 'auto',
        fetchFormat: true
      });
    }
    return url;
  };

  // Handle card click to navigate to user detail page
  const handleCardClick = () => {
    router.push(`/user/${user._id}`);
  };

  // Handle image click to open modal
  const handleImageClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsImageModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  // Handle click outside modal to close it
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsImageModalOpen(false);
    }
  };

  // Handle reminder button click
  const handleReminderClick = (e) => {
    e.stopPropagation();
    
    // Button click animation
    if (reminderButtonRef.current) {
      gsap.to(reminderButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        onComplete: () => {
          gsap.to(reminderButtonRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "back.out(2)"
          });
        }
      });
    }
    
    setIsReminderModalOpen(true);
  };

  // Handle setting a reminder
  const handleSetReminder = async (reminderData) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to set reminder');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting reminder:', error);
      return Promise.reject(error);
    }
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300"
        onClick={() => router.push(`/user/${user._id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg blur-sm"></div>
          <div className="relative">
            {/* Card image */}
            <div 
              className="relative h-64 w-full overflow-hidden"
              onClick={(e) => {
                if (user.image && !imageError) {
                  e.stopPropagation();
                  setIsImageModalOpen(true);
                }
              }}
            >
              {user.image && !imageError ? (
                <>
                  <Image 
                    ref={imageRef}
                    src={optimizeCloudinaryUrl(user.image, 'w_800,h_600,c_fill,g_face')} 
                    alt={user.name} 
                    fill 
                    className="object-cover transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={handleImageError}
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <FaExpand className="text-white w-8 h-8" />
                  </div>
                </>
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${user.option === 'friendship' ? 'from-blue-800/50 to-blue-600/50' : 
                                                                  user.option === 'relationship' ? 'from-pink-800/50 to-pink-600/50' : 
                                                                  user.option === 'suggestions' ? 'from-purple-800/50 to-purple-600/50' : 
                                                                  'from-purple-800/50 to-pink-800/50'} flex items-center justify-center`}>
                  <FaImage className="text-white/50 w-12 h-12 animate-pulse-slow" />
                </div>
              )}
              
              {/* Add gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
            </div>
            
            {/* Favorite button positioned on top of image */}
            <button
              ref={favoriteButtonRef}
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 ${isFavorite ? 'bg-pink-500/70' : 'bg-white/20'}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <FaHeart className="w-5 h-5 text-white drop-shadow-md" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-white drop-shadow-md" />
              )}
            </button>
            
            {/* Reminder button - only show for favorites and when showReminderButton is true */}
            {isFavorite && showReminderButton && (
              <button
                ref={reminderButtonRef}
                onClick={handleReminderClick}
                className="absolute top-3 right-14 p-2 rounded-full bg-purple-500/70 transition-all duration-200 hover:scale-110"
                aria-label="Set reminder"
              >
                <FaBell className="w-5 h-5 text-white drop-shadow-md" />
              </button>
            )}
            
            {/* Option tag positioned on top of image */}
            {user.option && (
              <div className="absolute top-3 left-3">
                <span 
                  ref={tagRef}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getOptionTypeColor(user.option)} transition-all duration-200`}
                >
                  {user.option.charAt(0).toUpperCase() + user.option.slice(1)}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 bg-white/5" ref={contentRef}>
            <div>
              <h3 
                ref={nameRef}
                className="text-xl font-semibold text-white mb-1 text-shadow-md"
              >
                {user.name}
              </h3>
              <p className="text-white/80 font-medium">
                {user.age} years • {formatGender(user.gender)}
              </p>
            </div>

            <div className="mt-4">
              <div 
                ref={locationRef}
                className="flex items-center text-gray-300 mb-2"
              >
                <FaMapMarkerAlt className="mr-2 transition-transform duration-200" />
                <span className="font-medium">{user.residence || 'Location not specified'}</span>
              </div>
              {user.education && (
                <div className="flex items-center text-gray-300 mb-2">
                  <FaGraduationCap className="mr-2" />
                  <span className="font-medium">{user.education} {user.educationProgram ? `(${user.educationProgram})` : ''}</span>
                </div>
              )}
              {user.passion && (
                <div className="flex items-center text-gray-300 mb-2">
                  <FaHeartPassion className="mr-2 text-pink-300" />
                  <span className="font-medium">{user.passion}</span>
                </div>
              )}
              {user.hobbies && (
                <div className="flex items-center text-gray-300 mb-2">
                  <FaMusic className="mr-2 text-purple-300" />
                  <span className="font-medium">{user.hobbies}</span>
                </div>
              )}
            </div>

            {(user.reason || user.loveReason) && (
              <div className="mt-4 bg-white/10 p-3 rounded-lg border border-white/10" ref={bioRef}>
                <p className="text-white/90 font-medium line-clamp-2">{user.reason || user.loveReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && user.image && !imageError && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleModalBackdropClick}
        >
          <div 
            ref={modalRef}
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-[80vh]">
              <Image 
                src={getHighQualityImageUrl(user.image)} 
                alt={user.name} 
                fill 
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="text-white/80">{user.age} years • {formatGender(user.gender)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {isReminderModalOpen && (
        <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          favoriteId={user.favoriteRecordId || user._id}
          favoriteUser={user}
          onSave={handleSetReminder}
        />
      )}
    </>
  );
};

export default UserCard; 
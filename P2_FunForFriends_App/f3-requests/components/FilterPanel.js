'use client';

import { useState, useEffect, useRef } from 'react';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import { gsap } from 'gsap';
import { fadeIn, slideInLeft, buttonClickAnimation } from '@/lib/animations';

const FilterPanel = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    option: '',
  });

  const filterPanelRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterContentRef = useRef(null);
  const applyButtonRef = useRef(null);
  const resetButtonRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Button click animation
    if (applyButtonRef.current) {
      buttonClickAnimation(applyButtonRef.current);
    }
    
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleResetFilters = () => {
    // Button click animation
    if (resetButtonRef.current) {
      buttonClickAnimation(resetButtonRef.current);
    }
    
    const resetFilters = {
      gender: '',
      minAge: '',
      maxAge: '',
      option: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Initial animations
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
    
    // Animate filter button
    if (filterButtonRef.current) {
      fadeIn(filterButtonRef.current, 0.2, 0.5);
    }
  }, []);

  // Handle filter panel animations
  useEffect(() => {
    if (!filterPanelRef.current) return;
    
    if (isOpen) {
      // Show animation
      gsap.fromTo(
        filterPanelRef.current,
        { 
          opacity: 0,
          y: -20,
          height: 0,
        },
        { 
          opacity: 1,
          y: 0,
          height: 'auto',
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            // Animate filter content
            if (filterContentRef.current) {
              gsap.fromTo(
                filterContentRef.current.children,
                { opacity: 0, y: 10 },
                { 
                  opacity: 1, 
                  y: 0, 
                  stagger: 0.05, 
                  duration: 0.3 
                }
              );
            }
          }
        }
      );
    } else {
      // Hide animation
      gsap.to(
        filterPanelRef.current,
        { 
          opacity: 0,
          y: -20,
          height: 0,
          duration: 0.3,
          ease: "power2.in"
        }
      );
    }
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mb-6 lg:mb-0">
      {/* Mobile filter toggle button */}
      <div 
        ref={filterButtonRef}
        className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md cursor-pointer border border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaFilter className="text-pink-300 mr-2" />
          <span className="font-medium text-white">Filters</span>
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <FaTimes className="text-white/80" />
          ) : (
            <span className="text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div 
        ref={filterPanelRef}
        className={`overflow-hidden ${!isOpen && 'h-0 opacity-0'}`}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg blur-sm"></div>
          <div className="relative bg-white/10 backdrop-blur-md p-5 rounded-lg shadow-md border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center text-shadow-sm">
                <FaFilter className="text-pink-300 mr-2" />
                <span>Filter Requests</span>
              </h2>
              <div className="hidden lg:block">
                <span className="text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              </div>
            </div>
            
            <div ref={filterContentRef} className="space-y-4">
              {/* Gender filter */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-white mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-white/30 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all text-white"
                >
                  <option value="">All</option>
                  <option value="Munda">Male</option>
                  <option value="Kudii">Female</option>
                </select>
              </div>
              
              {/* Age range filters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="minAge" className="block text-sm font-medium text-white mb-1">
                    Min Age
                  </label>
                  <input
                    type="number"
                    id="minAge"
                    name="minAge"
                    min="0"
                    value={filters.minAge}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-white/30 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all bg-gray-800 text-white"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label htmlFor="maxAge" className="block text-sm font-medium text-white mb-1">
                    Max Age
                  </label>
                  <input
                    type="number"
                    id="maxAge"
                    name="maxAge"
                    min="0"
                    value={filters.maxAge}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-white/30 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all bg-gray-800 text-white"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              {/* Option filter */}
              <div>
                <label htmlFor="option" className="block text-sm font-medium text-white mb-1">
                  Request Type
                </label>
                <select
                  id="option"
                  name="option"
                  value={filters.option}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-white/30 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all text-white"
                >
                  <option value="">All Types</option>
                  <option value="friendship">Friendship</option>
                  <option value="relationship">Relationship</option>
                  <option value="suggestions">Suggestions</option>
                </select>
              </div>
              
              {/* Filter action buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  ref={applyButtonRef}
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center shadow-md"
                >
                  <FaSearch className="mr-2" />
                  Apply Filters
                </button>
                <button
                  ref={resetButtonRef}
                  onClick={handleResetFilters}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-md transition-all duration-200 border border-white/30"
                >
                  Reset
                </button>
              </div>
              
              {/* Active filters summary */}
              {Object.values(filters).some(Boolean) && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h3 className="text-sm font-medium text-white mb-2">Active Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.gender && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/30 text-white">
                        Gender: {filters.gender === 'Munda' ? 'Male' : 'Female'}
                      </span>
                    )}
                    {(filters.minAge || filters.maxAge) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/30 text-white">
                        Age: {filters.minAge || '0'} - {filters.maxAge || '∞'}
                      </span>
                    )}
                    {filters.option && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/30 text-white">
                        Type: {filters.option.charAt(0).toUpperCase() + filters.option.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
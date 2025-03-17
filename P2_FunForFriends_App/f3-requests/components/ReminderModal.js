'use client';

import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTimes, FaCalendarAlt, FaBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { gsap } from 'gsap';
import { modalOpenAnimation, modalCloseAnimation, buttonClickAnimation } from '@/lib/animations';

const ReminderModal = ({ isOpen, onClose, favoriteId, favoriteUser, onSave }) => {
  const [reminderDate, setReminderDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const modalContainerRef = useRef(null);
  const modalContentRef = useRef(null);
  const submitButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Set default message when favorite user changes
  useEffect(() => {
    if (favoriteUser && favoriteUser.name) {
      setMessage(`Reminder to connect with ${favoriteUser.name}`);
    }
  }, [favoriteUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a reminder message');
      
      // Shake animation for empty message
      gsap.to(document.getElementById('message'), {
        x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
        duration: 0.6,
        ease: "power1.inOut"
      });
      
      return;
    }
    
    // Button click animation
    if (submitButtonRef.current) {
      buttonClickAnimation(submitButtonRef.current);
    }
    
    setIsLoading(true);
    
    try {
      await onSave({
        favoriteId,
        message,
        date: reminderDate,
      });
      
      toast.success('Reminder set successfully');
      handleClose();
      
      // Reset form
      setMessage('');
      setReminderDate(new Date());
    } catch (error) {
      toast.error(error.message || 'Failed to set reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    
    // Button click animation if cancel button was clicked
    if (cancelButtonRef.current) {
      buttonClickAnimation(cancelButtonRef.current);
    }
    
    // Close animation
    modalCloseAnimation(modalContainerRef.current, modalContentRef.current, () => {
      onClose();
      setIsClosing(false);
    });
  };

  // Modal open animation
  useEffect(() => {
    if (isOpen && modalContainerRef.current && modalContentRef.current) {
      // Reset closing state
      setIsClosing(false);
      
      // Run open animation
      modalOpenAnimation(modalContainerRef.current, modalContentRef.current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 transition-opacity"
      onClick={handleClose}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          ref={modalContentRef}
          className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg blur-sm"></div>
            <div className="relative bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <FaBell className="text-pink-400 mr-2" />
                  Set Reminder for {favoriteUser?.name}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                    Reminder Message
                  </label>
                  <textarea
                    id="message"
                    rows="3"
                    className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-700 rounded-md transition-shadow duration-200 hover:shadow-sm bg-gray-800 text-white"
                    placeholder="Enter your reminder message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-1">
                    Reminder Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={reminderDate}
                      onChange={(date) => setReminderDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-700 rounded-md transition-shadow duration-200 hover:shadow-sm bg-gray-800 text-white"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    ref={submitButtonRef}
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-lg"
                  >
                    {isLoading ? 'Saving...' : 'Set Reminder'}
                  </button>
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={handleClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal; 
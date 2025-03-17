'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaStar, FaBell } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { slideInLeft, slideInRight } from '@/lib/animations';

const Navbar = () => {
  const pathname = usePathname();
  const logoRef = useRef(null);
  const navItemsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: <FaStar className="w-5 h-5" />,
    },
    {
      name: 'Reminders',
      path: '/reminders',
      icon: <FaBell className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    // Logo animation
    slideInLeft(logoRef.current, 0, 0.7);
    
    // Desktop nav items animation
    if (navItemsRef.current) {
      gsap.fromTo(
        navItemsRef.current.children,
        { 
          y: -20, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out"
        }
      );
    }
    
    // Mobile menu animation
    if (mobileMenuRef.current) {
      slideInRight(mobileMenuRef.current, 0.2, 0.5);
    }
  }, []);

  // Animation for active link indicator
  useEffect(() => {
    const activeLinks = document.querySelectorAll('.nav-link-active');
    
    gsap.fromTo(
      activeLinks,
      { width: 0 },
      { 
        width: '100%', 
        duration: 0.4, 
        ease: "power1.out" 
      }
    );
  }, [pathname]);

  return (
    <nav className="bg-white/10 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center" ref={logoRef}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-yellow-500/30 rounded-lg blur-sm"></div>
                <h1 className="relative text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300 px-2 py-1 text-shadow-md">
                  F3 Requests
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8" ref={navItemsRef}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                    pathname === item.path
                      ? 'text-white bg-white/20 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`mr-2 ${pathname === item.path ? 'animate-pulse-slow' : ''}`}>{item.icon}</span>
                  {item.name}
                  {pathname === item.path && (
                    <span className="absolute bottom-0 left-0 h-0.5 bg-pink-400 nav-link-active"></span>
                  )}
                </Link>
              ))}
            </div>
            <div className="flex md:hidden" ref={mobileMenuRef}>
              <div className="flex space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`inline-flex flex-col items-center justify-center p-2 rounded-md ${
                      pathname === item.path
                        ? 'text-white bg-white/20 shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    aria-label={item.name}
                  >
                    <span className={pathname === item.path ? 'animate-pulse-slow' : ''}>{item.icon}</span>
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
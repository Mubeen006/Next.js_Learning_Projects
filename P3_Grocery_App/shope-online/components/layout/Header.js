import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const dropdownRef = useRef(null);
  
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/products?search=${searchQuery}`);
  };

  // Handle clicks outside of dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Shope Online
          </Link>
          
          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:block flex-grow mx-10">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-full text-gray-700 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-4 text-gray-600"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-green-200">
              Products
            </Link>
            <Link href="/shopping-lists" className="hover:text-green-200">
              My Lists
            </Link>
            
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center hover:text-green-200"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  <span className="mr-1">{session.user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1" onClick={(e) => e.stopPropagation()}>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {session.user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="hover:text-green-200">
                Login
              </Link>
            )}
            
            <Link href="/cart" className="flex items-center hover:text-green-200">
              <ShoppingCartIcon className="h-5 w-5 mr-1" />
              Cart
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-4">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="mt-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 pr-10 rounded-full text-gray-700 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2 mr-4 text-gray-600"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-green-500 md:hidden">
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="block hover:text-green-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/shopping-lists" className="block hover:text-green-200">
                  My Lists
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <Link href="/profile" className="block hover:text-green-200">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="block hover:text-green-200">
                      My Orders
                    </Link>
                  </li>
                  {session.user.role === 'admin' && (
                    <li>
                      <Link href="/admin" className="block hover:text-green-200">
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block hover:text-green-200"
                    >
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/auth/login" className="block hover:text-green-200">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
} 
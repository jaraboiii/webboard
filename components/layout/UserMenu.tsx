'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/app/lib/actions/auth';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Get initials for avatar fallback
  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors focus:outline-none"
      >
        <div className="relative w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
          {user.avatarUrl && !imageError ? (
            <Image 
                src={user.avatarUrl} 
                alt={user.name} 
                className="object-cover"
                fill
                sizes="36px"
                unoptimized // Use unoptimized to allow external images without config
                onError={() => setImageError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 mb-1">
            <p className="text-base font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-400 truncate font-normal mt-0.5">{user.email}</p>
          </div>
          
          <div className="px-2 py-1 space-y-0.5">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-1.5 rounded-lg bg-gray-50 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              ตั้งค่าบัญชี
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
            >
              <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

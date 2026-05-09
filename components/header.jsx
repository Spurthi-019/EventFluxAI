'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Cities');

  const locations = ['All Cities', 'Haryana', 'Gurgaon', 'Delhi', 'Bangalore', 'Mumbai', 'Hyderabad'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-b from-gray-950 via-purple-950/50 to-transparent backdrop-blur-xl z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Top Row: Logo + Navigation */}
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-purple-500/50 transition">
                E
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                EventFluxAI
              </span>
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/explore" className="text-gray-300 hover:text-white transition text-sm font-medium">
                Explore
              </Link>
              <Button
                onClick={() => router.push('/create-event')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6"
              >
                + Create Event
              </Button>
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition">
                👤
              </button>
            </div>
          </div>

          {/* Bottom Row: Search + Filters */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3 bg-gray-900/60 border border-purple-500/30 rounded-lg px-4 py-2.5 hover:border-purple-500/50 transition">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
              />
            </form>

            {/* Location Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-gray-900/60 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white hover:border-purple-500/50 transition">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">{selectedLocation}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-50">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      router.push(`/explore?location=${encodeURIComponent(location)}`);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-purple-600/30 transition ${
                      selectedLocation === location ? 'bg-purple-600/50 text-purple-300' : 'text-gray-300'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-32" />
    </>
  );
};

export default Header;

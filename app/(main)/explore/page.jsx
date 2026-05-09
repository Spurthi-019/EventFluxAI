'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import EventCard from '@/components/event-card';

const CATEGORIES = [
  { value: 'tech', label: '💻 Technology', emoji: '💻' },
  { value: 'music', label: '🎵 Music', emoji: '🎵' },
  { value: 'food', label: '🍽️ Food', emoji: '🍽️' },
  { value: 'sports', label: '⚽ Sports', emoji: '⚽' },
  { value: 'art', label: '🎨 Art', emoji: '🎨' },
  { value: 'business', label: '💼 Business', emoji: '💼' },
  { value: 'health', label: '💪 Health', emoji: '💪' },
  { value: 'networking', label: '🤝 Networking', emoji: '🤝' },
];

const LOCATIONS = ['All Cities', 'Haryana', 'Gurgaon', 'Delhi', 'Bangalore', 'Mumbai', 'Hyderabad'];

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allEvents = useQuery(api.events.getAllEvents) || [];

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All Cities');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Search filter
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }

      // Ticket type filter
      if (ticketType && event.ticketType !== ticketType) {
        return false;
      }

      // Location filter (simple match)
      if (selectedLocation !== 'All Cities' && !event.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [allEvents, searchQuery, selectedCategory, selectedLocation, ticketType]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Cities');
    setSelectedCategory('');
    setTicketType('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || ticketType || selectedLocation !== 'All Cities';

  return (
    <div className="w-full bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950 min-h-screen">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Discover Events</h1>
            <p className="text-gray-400 mt-2">Explore featured events, find what's happening locally, or browse events across India</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 bg-gray-900/60 border border-purple-500/30 rounded-lg px-4 py-3 hover:border-purple-500/50 transition">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block space-y-6">
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="w-full border border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
              >
                Clear Filters
              </Button>
            )}

            {/* Location Filter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                Location
              </h3>
              <div className="space-y-2">
                {LOCATIONS.map((location) => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="location"
                      value={location}
                      checked={selectedLocation === location}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-gray-400 group-hover:text-white transition text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <span className="text-gray-400 group-hover:text-white transition text-sm">All Categories</span>
                </label>
                {CATEGORIES.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => setSelectedCategory(cat.value)}
                      className="w-4 h-4 rounded accent-purple-600"
                    />
                    <span className="text-gray-400 group-hover:text-white transition text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ticket Type Filter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Ticket Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticketType"
                    value=""
                    checked={ticketType === ''}
                    onChange={() => setTicketType('')}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <span className="text-gray-400 group-hover:text-white transition text-sm">All Types</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticketType"
                    value="free"
                    checked={ticketType === 'free'}
                    onChange={() => setTicketType('free')}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <span className="text-gray-400 group-hover:text-white transition text-sm">Free</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ticketType"
                    value="paid"
                    checked={ticketType === 'paid'}
                    onChange={() => setTicketType('paid')}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <span className="text-gray-400 group-hover:text-white transition text-sm">Paid</span>
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-gray-900 border border-purple-500/30 text-white hover:bg-purple-600/10 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Info */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                {filteredEvents.length > 0
                  ? `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`
                  : 'No events found'}
              </p>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/events/${event.slug}`)}
                  >
                    <EventCard event={event} variant="grid" className="group-hover:scale-105 transition" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <Button
                  onClick={handleClearFilters}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Made with ❤️ by EventFluxAI.
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Music, Code, Utensils, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import EventCard from '@/components/event-card';

export default function Home() {
  const router = useRouter();
  const allEvents = useQuery(api.events.getAllEvents) || [];
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      // Get first 4 as featured (or random for better UX)
      setFeaturedEvents(allEvents.slice(0, 4));
      // Get next 4 as trending
      setTrendingEvents(allEvents.slice(4, 8));
    }
  }, [allEvents]);

  const stats = [
    { icon: '📅', label: 'Events', value: allEvents.length },
    { icon: '👥', label: 'Users', value: '1000+' },
    { icon: '🌍', label: 'Cities', value: '50+' },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 text-sm text-purple-300">
                <Sparkles className="w-4 h-4" />
                Discover Amazing Events
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Discover &<br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  create amazing
                </span>
                <br />
                events.
              </h1>
              <p className="text-lg text-gray-400 max-w-lg">
                Whether you're hosting or attending, EventFluxAI makes every event memorable. Join our community today.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/explore')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg text-base font-semibold flex items-center justify-center gap-2 group"
              >
                Explore Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Button>
              <Button
                onClick={() => router.push('/create-event')}
                variant="outline"
                className="border border-purple-500/50 text-white hover:bg-purple-600/10 px-8 py-6 rounded-lg text-base font-semibold"
              >
                Create Event
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-500/20">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-3xl">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Phone Mockup Placeholder */}
          <div className="hidden lg:block relative h-600">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Phone Frame */}
              <div className="relative w-64 h-520 bg-gray-900 rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden">
                {/* Screen Content */}
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex flex-col items-center justify-center">
                  <div className="text-center space-y-4 px-6">
                    <Music className="w-16 h-16 text-white mx-auto" />
                    <h3 className="text-2xl font-bold text-white">DJ Set</h3>
                    <p className="text-white/80 text-sm">at Club Fugazi</p>
                    <p className="text-white/60 text-xs">Sunday, July 23</p>
                    <div className="flex justify-center gap-2 mt-4">
                      <div className="w-8 h-8 rounded-full bg-white/20"></div>
                      <div className="w-8 h-8 rounded-full bg-white/20"></div>
                      <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-900 rounded-b-2xl"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-20 -bottom-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 top-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-purple-500/20">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Featured Events</h2>
                <p className="text-gray-400 mt-2">Check out our handpicked events happening soon</p>
              </div>
              <Link href="/explore" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm font-semibold group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <div key={event._id} className="group cursor-pointer" onClick={() => router.push(`/events/${event.slug}`)}>
                  <EventCard event={event} variant="grid" className="group-hover:scale-105 transition" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Events Section */}
      {trendingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-purple-500/20">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Events Near You</h2>
                <p className="text-gray-400 mt-2">Happening in Gurgaon</p>
              </div>
              <Link href="/explore" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm font-semibold group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingEvents.slice(0, 3).map((event) => (
                <div key={event._id} className="group cursor-pointer" onClick={() => router.push(`/events/${event.slug}`)}>
                  <EventCard event={event} variant="grid" className="group-hover:scale-105 transition" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-purple-500/20">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 p-12 text-center">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to create your event?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of organizers who use EventFluxAI to create unforgettable experiences.
            </p>
            <Button
              onClick={() => router.push('/create-event')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-lg text-base font-semibold mx-auto"
            >
              Start Creating
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Made with ❤️ by EventFluxAI.
        </div>
      </footer>
    </div>
  );
}

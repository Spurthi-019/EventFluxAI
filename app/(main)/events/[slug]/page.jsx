'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Share2, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import RegistrationDialog from './_components/registration-dialog';

const CATEGORY_ICONS = {
  tech: '💻',
  music: '🎵',
  sports: '⚽',
  art: '🎨',
  food: '🍽️',
  business: '💼',
  health: '🏥',
  networking: '👥',
};

const CATEGORY_LABELS = {
  tech: 'Technology',
  music: 'Music',
  sports: 'Sports',
  art: 'Art',
  food: 'Food',
  business: 'Business',
  health: 'Health',
  networking: 'Networking',
};

export default function EventDetailsPage({ params }) {
  const router = useRouter();
  const { slug } = params;
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch event
  const event = useQuery(api.events.getEventBySlug, { slug });
  
  // Fetch registrations for this event
  const registrations = useQuery(api.registrations.getEventRegistrations, { eventId: event?._id }) || [];

  const registerMutation = useMutation(api.registrations.registerForEvent);

  if (!event) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-400 mx-auto animate-spin" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  const handleRegistration = async (attendeeData) => {
    try {
      setIsRegistering(true);
      await registerMutation({
        eventId: event._id,
        attendeeName: attendeeData.name,
        attendeeEmail: attendeeData.email,
        attendeePhone: attendeeData.phone,
      });
      setShowRegistration(false);
      toast.success(`Successfully registered for ${event.title}! 🎉`);
    } catch (error) {
      toast.error('Failed to register for event');
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  const categoryIcon = CATEGORY_ICONS[event.category] || '📅';
  const categoryLabel = CATEGORY_LABELS[event.category] || 'Event';

  return (
    <div className="w-full bg-gradient-to-b from-gray-950 via-purple-950/30 to-gray-950 min-h-screen pb-20">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-6 py-8 pt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition text-sm font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          Back
        </button>
      </div>

      {/* Event Header with Image */}
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Image Placeholder */}
        <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">{categoryIcon}</div>
              <p className="text-white/60">{event.title}</p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Category */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{categoryIcon}</span>
                <div className="inline-block bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2">
                  <span className="text-sm font-medium text-purple-300">{categoryLabel}</span>
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{event.title}</h1>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  Date
                </div>
                <p className="text-white font-semibold">{format(new Date(event.startDate), 'MMM dd, yyyy')}</p>
              </div>

              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  Time
                </div>
                <p className="text-white font-semibold">
                  {format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a')} - {format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a')}
                </p>
              </div>

              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <p className="text-white font-semibold">{event.location}</p>
              </div>

              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />
                  Capacity
                </div>
                <p className="text-white font-semibold">{event.capacity} spots</p>
              </div>

              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />
                  Registered
                </div>
                <p className="text-white font-semibold">{registrations.length} attendees</p>
              </div>

              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="text-gray-400 text-sm">Ticket Type</div>
                <p className="text-white font-semibold">
                  {event.ticketType === 'free' ? 'Free' : `$${event.ticketPrice}`}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">About this event</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{event.description}</p>
            </div>

            {/* Attendees Section */}
            {registrations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Registered Attendees</h2>
                <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {registrations.slice(0, 6).map((reg, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition tooltip"
                        title={reg.attendeeName}
                      >
                        {reg.attendeeName.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {registrations.length > 6 && (
                      <div className="w-12 h-12 rounded-full bg-gray-800 border border-purple-500/20 flex items-center justify-center text-gray-400 font-bold text-sm">
                        +{registrations.length - 6}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {registrations.length} {registrations.length === 1 ? 'person' : 'people'} already registered
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Registration Card */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Ticket Price</p>
                  <p className="text-3xl font-bold text-white">
                    {event.ticketType === 'free' ? 'Free' : `$${event.ticketPrice}`}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Spots Remaining</span>
                  <span className={`font-bold ${registrations.length >= event.capacity ? 'text-red-400' : 'text-green-400'}`}>
                    {Math.max(0, event.capacity - registrations.length)} / {event.capacity}
                  </span>
                </div>

                <Button
                  onClick={() => setShowRegistration(true)}
                  disabled={registrations.length >= event.capacity}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registrations.length >= event.capacity ? 'Event Full' : 'Register Now'}
                </Button>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 border border-purple-500/30 hover:border-purple-500/50 rounded-lg py-3 text-gray-300 hover:text-white transition">
                    <Heart className="w-4 h-4" />
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-purple-500/30 hover:border-purple-500/50 rounded-lg py-3 text-gray-300 hover:text-white transition">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Event Info Card */}
              <div className="bg-gray-900/40 border border-purple-500/20 rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-white">Organized by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    {event.organizerId?.charAt(0).toUpperCase() || '👤'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Event Creator</p>
                    <p className="text-gray-400 text-sm">@eventfluxai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Dialog */}
      <RegistrationDialog
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onRegister={handleRegistration}
        eventTitle={event.title}
        isLoading={isRegistering}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Music, Heart, Users, QrCode, Loader } from 'lucide-react';
import { GlobalQRCode } from '@/app/components/GlobalQRCode';

// Define your wedding events
const WEDDING_EVENTS = [
  {
    id: 'haldi',
    name: 'Haldi Ceremony',
    description: 'Traditional turmeric ceremony',
    icon: Sparkles,
    color: 'bg-yellow-500',
  },
  {
    id: 'sangeeth',
    name: 'Sangeeth',
    description: 'Musical evening celebration',
    icon: Music,
    color: 'bg-pink-500',
  },
   {
    id: 'groom',
    name: 'Groom To Be',
    description: 'Musical evening celebration',
    icon: Music,
    color: 'bg-blue-500',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Main wedding ceremony',
    icon: Users,
    color: 'bg-red-500',
  },


  // Add more events as needed
];

export default function EventsListPage() {
  const [showQR, setShowQR] = useState(false);
  const [eventPhotoCounts, setEventPhotoCounts] = useState<Record<string, number>>({});
  const [isCheckingPhotos, setIsCheckingPhotos] = useState(true);

  // Check if photos exist for each event
  useEffect(() => {
    const checkEventPhotos = async () => {
      setIsCheckingPhotos(true);
      const counts: Record<string, number> = {};

      // Check all events in parallel
      const photoChecks = WEDDING_EVENTS.map(async (event) => {
        try {
          const res = await fetch(`/api/photos?event=${event.id}`);
          if (res.ok) {
            const data = await res.json();
            counts[event.id] = data.count || 0;
          } else {
            counts[event.id] = 0;
          }
        } catch (error) {
          console.error(`Error checking photos for ${event.id}:`, error);
          counts[event.id] = 0;
        }
      });

      await Promise.all(photoChecks);
      setEventPhotoCounts(counts);
      setIsCheckingPhotos(false);
    };

    checkEventPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Momula&apos;s Wedding Photo Gallery
          </h1>
          <p className="text-gray-600 mt-2">Select an event to view photos</p>
        </div>
      </div>

      {/* Global QR Code Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <QrCode className="h-5 w-5" />
            {showQR ? "Hide QR Code" : "Show Global QR Code"}
          </button>
        </div>
        {showQR && (
          <div className="mb-12 flex justify-center">
            <GlobalQRCode size={250} />
          </div>
        )}
      </div>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isCheckingPhotos ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-gray-600">Checking available photos...</span>
            </div>
          ) : (
            WEDDING_EVENTS.map((event) => {
              const IconComponent = event.icon;
              const photoCount = eventPhotoCounts[event.id] || 0;
              const isEnabled = photoCount > 0;
              return (
              <div key={event.id}>
                {isEnabled ? (
                  <Link
                    href={`/event/${event.id}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${event.color} p-4 rounded-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                        <div className="mt-4 text-indigo-600 font-semibold text-sm group-hover:underline">
                          View Photos →
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 opacity-60 cursor-not-allowed">
                    <div className="flex items-start gap-4">
                      <div className={`${event.color} p-4 rounded-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="text-sm font-semibold text-gray-400">
                          Photos coming soon
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-indigo-900 text-center">
            📸 Click on any event above to view all photos from that event
          </p>
        </div>
      </main>
    </div>
  );
}

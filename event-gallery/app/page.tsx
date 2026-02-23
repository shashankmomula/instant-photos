'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, QrCode, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [eventId, setEventId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Optionally redirect to events page on mount
  // Uncomment the useEffect below if you want automatic redirect
  // useEffect(() => {
  //   router.push('/events');
  // }, [router]);

  const handleJoinEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId.trim()) {
      alert('Please enter an event ID');
      return;
    }
    router.push(`/event/${eventId.trim()}`);
  };

  const demoEventId = 'demo-event-1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Camera className="h-8 w-8" />
            Event Photo Gallery
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Photos Instantly
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Upload your selfie and AI automatically finds all photos with your face from the event. Fast, smart, and fun!
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <QrCode className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Scan & Join</h3>
                  <p className="text-gray-600">Scan the event QR code to access the gallery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Upload Selfie</h3>
                  <p className="text-gray-600">Take or upload a photo of yourself</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Get Matched</h3>
                  <p className="text-gray-600">AI finds all your photos and you can download them</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Event Form */}
          <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Join Event</h3>

            <form onSubmit={handleJoinEvent} className="space-y-4">
              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                  Event ID
                </label>
                <input
                  id="eventId"
                  type="text"
                  placeholder="Enter event ID"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Loading...' : 'Join Event'}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try demo</span>
              </div>
            </div>

            <Link
              href="/events"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center mb-3"
            >
              View All Events
            </Link>

            <Link
              href={`/event/${demoEventId}`}
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              View Demo Event
            </Link>

            <p className="text-xs text-gray-500 text-center mt-2">
              Event ID: <code className="bg-gray-100 px-2 py-1 rounded">{demoEventId}</code>
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">🔒 Private</h4>
            <p className="text-gray-600">Your photos are secure and only shared with event attendees</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">⚡ Fast</h4>
            <p className="text-gray-600">AI-powered matching instantly finds all your photos</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">📱 Mobile-Friendly</h4>
            <p className="text-gray-600">Works perfectly on phones, tablets, and computers</p>
          </div>
        </div>
      </main>
    </div>
  );
}

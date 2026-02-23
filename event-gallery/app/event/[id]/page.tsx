"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PhotoGrid } from "@/app/components/PhotoGrid";
import { ImageViewer } from "@/app/components/ImageViewer";
import { ArrowLeft, Loader } from "lucide-react";

export default function EventGallery() {
  const params = useParams();
  const id = params.id as string;

  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [error, setError] = useState<string>("");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Fetch event photos on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoadingPhotos(true);
        setError("");
        const res = await fetch(`/api/photos?event=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = await res.json();
        setPhotos(data.photos || []);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load event photos. Please try again.");
      } finally {
        setIsLoadingPhotos(false);
      }
    };

    if (id) {
      fetchPhotos();
    }
  }, [id]);

  // Format event name for display
  const formatEventName = (eventId: string) => {
    return eventId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handlePhotoClick = (index: number) => {
    setViewerIndex(index);
  };

  const closeViewer = () => {
    setViewerIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {formatEventName(id)}
              </h1>
              <p className="text-gray-600">
                Event ID: <code className="bg-gray-100 px-2 py-1 rounded">{id}</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* All Event Photos Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Event Photos ({photos.length})
          </h2>
          {isLoadingPhotos ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg mb-2">
                No photos are available for this event yet.
              </p>
              <p className="text-sm text-gray-500">
                This event may not be completed yet, or photos are still being uploaded. Please check back a little later.
              </p>
            </div>
          ) : (
            <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
          )}
        </div>

        {/* Note about AI (disabled) */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            ℹ️ AI face matching is currently disabled. All photos from this event are shown above.
          </p>
        </div>
      </main>

      {/* Full-screen image viewer */}
      {viewerIndex !== null && photos.length > 0 && (
        <ImageViewer
          photos={photos}
          initialIndex={viewerIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
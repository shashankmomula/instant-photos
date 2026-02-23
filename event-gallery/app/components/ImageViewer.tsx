'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

// Force-download an image without opening the cloud URL in a new tab
async function downloadImage(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = url.split('/').pop() || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download image', err);
  }
}

interface ImageViewerProps {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageViewer({ photos, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const hasPhotos = photos.length > 0;
  const currentUrl = hasPhotos ? photos[currentIndex] : '';

  const goPrev = () => {
    if (!hasPhotos) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goNext = () => {
    if (!hasPhotos) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!hasPhotos) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white bg-black/50">
        <div className="text-sm font-medium">
          Photo {currentIndex + 1} of {photos.length}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
          <span>Close</span>
        </button>
      </div>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative px-4 pb-8">
        {/* Left arrow */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 text-white transition-all shadow-lg z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        {/* Image */}
        <img
          src={currentUrl}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[85vh] w-auto max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />

        {/* Right arrow */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 text-white transition-all shadow-lg z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>

      {/* Bottom bar with download */}
      <div className="px-4 pb-6 flex justify-center bg-black/50">
        <button
          type="button"
          onClick={() => downloadImage(currentUrl)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-100 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Download Photo</span>
        </button>
      </div>
    </div>
  );
}

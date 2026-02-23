'use client';

interface PhotoGridProps {
  photos: string[];
  isLoading?: boolean;
  onPhotoClick?: (index: number) => void;
}

async function requestDownload(url: string) {
  try {
    const res = await fetch(`/api/download?photoUrl=${encodeURIComponent(url)}`);
    if (!res.ok) {
      throw new Error('Failed to get download URL');
    }
    const data = await res.json();
    if (!data.signedUrl) {
      throw new Error('No signedUrl returned');
    }
    // Navigate to the signed URL so the browser handles Content-Disposition: attachment
    window.location.href = data.signedUrl;
  } catch (err) {
    console.error('Download failed', err);
    alert('Unable to download this photo right now. Please try again.');
  }
}

export function PhotoGrid({ photos, isLoading = false, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No photos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((url, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <button
            type="button"
            onClick={() => onPhotoClick && onPhotoClick(index)}
            className="block w-full focus:outline-none"
          >
            <img
              src={url}
              alt={`Photo ${index + 1}`}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </button>

          {/* Download button appears on hover in the bottom-right corner */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              requestDownload(url);
            }}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 bg-black/70 text-white text-sm px-3 py-1 rounded-full transition-opacity duration-300 cursor-pointer"
          >
            <span className="font-medium">Download</span>
          </button>
        </div>
      ))}
    </div>
  );
}

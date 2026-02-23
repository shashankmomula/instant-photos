'use client';

interface PhotoGridProps {
  photos: string[];
  isLoading?: boolean;
  onPhotoClick?: (index: number) => void;
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

          <a
            href={url}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 opacity-0 hover:opacity-100 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
          >
            <span className="text-white font-medium">Download</span>
          </a>
        </div>
      ))}
    </div>
  );
}

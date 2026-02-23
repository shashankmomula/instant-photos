'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface GlobalQRCodeProps {
  size?: number;
}

export function GlobalQRCode({ size = 300 }: GlobalQRCodeProps) {
  const eventsUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/events`;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border-2 border-indigo-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800">Scan to View All Events</h3>
      <QRCodeCanvas value={eventsUrl} size={size} level="H" includeMargin={true} />
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this QR code to see all wedding events and access your photos
      </p>
      <div className="text-xs text-gray-500 text-center">
        <p>URL: {eventsUrl}</p>
      </div>
    </div>
  );
}

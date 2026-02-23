'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeComponentProps {
  eventId: string;
  size?: number;
}

export function QRCodeComponent({ eventId, size = 200 }: QRCodeComponentProps) {
  const eventUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${eventId}`;

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">Scan to Join Event</h3>
      <QRCodeCanvas value={eventUrl} size={size} level="H" includeMargin={true} />
      <p className="text-sm text-gray-600 text-center">Event ID: {eventId}</p>
    </div>
  );
}

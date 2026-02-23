export const GCS_CONFIG = {
  bucket: process.env.NEXT_PUBLIC_GCS_BUCKET || 'event-photos-demo',
  baseUrl: process.env.NEXT_PUBLIC_GCS_BASE_URL || 'https://storage.googleapis.com/event-photos-demo',
};

export const BACKEND_API = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  endpoints: {
    match: '/match',
    health: '/health',
  },
};

export const FACE_MATCH_THRESHOLD = 0.6;

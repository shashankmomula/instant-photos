# Vercel Frontend Deployment Guide

## Build Commands

**Build Command:** `npm run build` (auto-detected by Vercel)

**Output Directory:** `.next` (auto-detected by Vercel)

**Install Command:** `npm install` (auto-detected by Vercel)

## Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Variables:

```
NEXT_PUBLIC_GCS_BUCKET=event-photos-demo
NEXT_PUBLIC_GCS_BASE_URL=https://storage.googleapis.com/event-photos-demo
NEXT_PUBLIC_BACKEND_URL=https://your-backend-project.vercel.app
```

**Important:** Replace `your-backend-project.vercel.app` with your actual backend Vercel URL after you deploy the backend.

## Deployment Steps

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Root Directory:** Set to `event-gallery`
5. **Framework Preset:** Next.js (auto-detected)
6. **Build Command:** `npm run build` (auto-detected)
7. **Output Directory:** `.next` (auto-detected)
8. **Install Command:** `npm install` (auto-detected)
9. Add all environment variables listed above
10. Click "Deploy"

## After Deployment

Your frontend will be available at:
```
https://your-frontend-project.vercel.app
```

## Testing

After deployment:
1. Visit your frontend URL
2. Go to `/events` page
3. Click on any event (e.g., "Haldi")
4. Photos should load from GCS
5. Click any photo to open full-screen viewer

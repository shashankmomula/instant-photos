# Vercel Backend Deployment Guide

## Build Commands

**Build Command:** (Leave empty - Vercel auto-detects Python)

**Output Directory:** (Leave empty)

**Install Command:** `pip install -r requirements.txt`

## Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Variables:

```
GCS_BUCKET_NAME=event-photos-demo
GOOGLE_APPLICATION_CREDENTIALS=<paste your entire credentials.json content here as a single line>
```

**Important:** For `GOOGLE_APPLICATION_CREDENTIALS`, you need to:
1. Open your `credentials.json` file
2. Copy the entire JSON content
3. Paste it as a single line in Vercel (remove all line breaks)
4. Or use Vercel's "Encrypted" option for secrets

### Optional Variables:

```
BACKEND_API_URL=https://your-backend-url.vercel.app
FACE_MATCH_THRESHOLD=0.6
```

## Deployment Steps

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Root Directory:** Set to `backend`
5. **Framework Preset:** Other (or leave blank)
6. **Build Command:** Leave empty
7. **Output Directory:** Leave empty
8. **Install Command:** `pip install -r requirements.txt`
9. Add all environment variables listed above
10. Click "Deploy"

## After Deployment

Your backend will be available at:
```
https://your-project-name.vercel.app
```

Use this URL in your frontend's `NEXT_PUBLIC_BACKEND_URL` environment variable.

## Testing

After deployment, test your backend:
```
https://your-project-name.vercel.app/health
```

Should return:
```json
{"status":"healthy","mode":"MVP (simplified for testing)","indexed_photos":0}
```

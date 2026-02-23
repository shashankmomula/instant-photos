# Complete Vercel Deployment Guide

## 🚀 Backend Deployment (Vercel)

### Project Settings:
- **Root Directory:** `backend`
- **Framework Preset:** Other
- **Build Command:** (Leave empty)
- **Output Directory:** (Leave empty)
- **Install Command:** `pip install -r requirements.txt`

### Environment Variables:
```
GCS_BUCKET_NAME=event-photos-demo
GOOGLE_APPLICATION_CREDENTIALS=<paste entire credentials.json as single line>
```

**How to set GOOGLE_APPLICATION_CREDENTIALS:**
1. Open `backend/credentials.json`
2. Copy entire content
3. In Vercel, paste as single line (remove line breaks)
4. Or use Vercel's "Encrypted" option

### Backend URL:
After deployment, your backend will be at:
```
https://your-backend-name.vercel.app
```

Test it: `https://your-backend-name.vercel.app/health`

---

## 🎨 Frontend Deployment (Vercel)

### Project Settings:
- **Root Directory:** `event-gallery`
- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### Environment Variables:
```
NEXT_PUBLIC_GCS_BUCKET=event-photos-demo
NEXT_PUBLIC_GCS_BASE_URL=https://storage.googleapis.com/event-photos-demo
NEXT_PUBLIC_BACKEND_URL=https://your-backend-name.vercel.app
```

**Important:** Replace `your-backend-name.vercel.app` with your actual backend URL from step 1.

### Frontend URL:
After deployment, your frontend will be at:
```
https://your-frontend-name.vercel.app
```

---

## 📋 Deployment Order:

1. **Deploy Backend First**
   - Get the backend URL
   - Test `/health` endpoint

2. **Deploy Frontend Second**
   - Use backend URL in `NEXT_PUBLIC_BACKEND_URL`
   - Deploy

3. **Test Everything**
   - Visit frontend URL
   - Go to `/events`
   - Click an event
   - Verify photos load

---

## 🔧 Quick Reference:

### Backend Build Commands:
```
Install: pip install -r requirements.txt
Build: (automatic)
Start: (Vercel handles this)
```

### Frontend Build Commands:
```
Install: npm install
Build: npm run build
Start: (Vercel handles this)
```

---

## ⚠️ Important Notes:

1. **Credentials:** Never commit `credentials.json` to git (already in .gitignore)
2. **Environment Variables:** Set them in Vercel dashboard, not in code
3. **CORS:** Already configured in backend to allow all origins
4. **GCS Bucket:** Must be public for photos to display

---

## 🧪 Testing After Deployment:

### Backend:
```bash
curl https://your-backend.vercel.app/health
curl https://your-backend.vercel.app/list-photos?event_id=haldi
```

### Frontend:
1. Visit: `https://your-frontend.vercel.app/events`
2. Click "Show Global QR Code"
3. Click any event (e.g., "Haldi")
4. Click any photo → Should open full-screen viewer
5. Test navigation arrows and download

---

## 🆘 Troubleshooting:

**Backend not working?**
- Check environment variables are set correctly
- Verify credentials.json content is correct (single line)
- Check Vercel function logs

**Frontend can't reach backend?**
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check backend is deployed and `/health` works
- Check browser console for CORS errors

**Photos not loading?**
- Verify GCS bucket is public
- Check bucket name matches in both frontend and backend
- Verify photos exist in correct folder structure

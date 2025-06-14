# Mukuvi OS - Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mukuvi-os)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📋 Pre-Deployment Checklist

- ✅ All dependencies are in `package.json`
- ✅ `vercel.json` configuration is set up
- ✅ Static files are in `src/gui/public/`
- ✅ API routes are configured
- ✅ Environment variables are set (if needed)

## 🔧 Configuration

### Environment Variables (Optional)
```
NODE_ENV=production
PORT=3000
```

### Vercel Settings
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `src/gui/public`
- **Install Command**: `npm install`

## 🌐 Features Available in Deployed Version

### ✅ Working Features:
- Complete GUI Desktop Environment
- All Security Tool Icons & Menus
- Terminal Interface
- Command Execution (demo mode)
- WiFi Scanner GUI
- Metasploit Interface
- Package Manager GUI
- Service Manager
- Project Creator
- System Monitor

### ⚠️ Limitations on Vercel:
- File system operations are limited to `/tmp`
- Some commands run in demo mode
- Real package installation not available
- Limited to serverless function execution time

## 🔒 Demo Credentials
- **Username**: `demo`
- **Password**: `demo`

## 📱 Mobile Responsive
The interface is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Local Development
```bash
npm install
npm run gui
```
Access at `http://localhost:3000`

## 📞 Support
For deployment issues, check:
1. Vercel function logs
2. Browser console for errors
3. Network tab for failed requests

## 🔄 Updates
To update your deployment:
```bash
git push origin main
# Vercel will auto-deploy
```

Or manually:
```bash
vercel --prod
```
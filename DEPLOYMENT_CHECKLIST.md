# CoachKeith - Vercel Deployment Checklist ✅

## Pre-Deployment Review ✓

### Project Status
- ✅ **Build**: `npm run build` completes successfully
- ✅ **Output**: Generates `dist/` folder with 18 static routes
- ✅ **Bundle Size**: Main entry file 2.34 MB (within limits)
- ✅ **Routing**: Expo Router with file-based routing configured
- ✅ **Styling**: Tailwind CSS + NativeWind configured
- ✅ **Configuration**: vercel.json optimized with caching headers

### Code Quality
- ✅ **Framework**: Expo 54.0.33 (latest stable)
- ✅ **React**: 19.1.0 with React DOM 19.1.0
- ✅ **TypeScript**: Strict mode enabled
- ✅ **Web Compatibility**: SQLite properly mocked on web platform
- ✅ **Dependencies**: All pinned to compatible versions
- ✅ **No API Keys**: Project is static (safe to push to GitHub)

---

## Deployment Steps

### Step 1: Prepare Git Repository
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial CoachKeith app ready for Vercel deployment"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/coach-keith.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel (Web UI - Easiest)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Select your GitHub repository
5. Vercel will auto-detect settings:
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `dist` ✓
   - **Framework**: Expo ✓
6. Click **"Deploy"**
7. Wait for deployment to complete (~2-3 minutes)

### Step 3: Deploy to Vercel (CLI - Alternative)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project or create new: Choose your preference
# - Confirm settings
# - Wait for deployment
```

---

## Post-Deployment Verification

### ✅ Smoke Testing
After deployment, test these critical flows:

1. **Homepage**
   - [ ] Home page loads and redirects to `/players`
   - [ ] No 404 errors in console
   - [ ] Page responsive on mobile/tablet

2. **Navigation**
   - [ ] Click all tab navigation items (Players, Plans, Schedule, Analysis)
   - [ ] All routes load without 404 errors
   - [ ] Back/forward navigation works

3. **Players Tab**
   - [ ] `/players` list displays properly
   - [ ] `/players/create` form loads
   - [ ] `/players/[id]` dynamic route works (if any players exist)

4. **Analysis Tab**
   - [ ] `/analysis` loads
   - [ ] `/analysis/record` loads

5. **Plans Tab**
   - [ ] `/plans` loads

6. **Schedule Tab**
   - [ ] `/schedule` loads

7. **Mobile Responsiveness**
   - [ ] Open DevTools → Toggle device toolbar (mobile view)
   - [ ] All layouts are responsive
   - [ ] Bottom tab navigation is visible

8. **Performance**
   - [ ] Page load time < 3 seconds
   - [ ] No JavaScript errors
   - [ ] CSS styles apply correctly
   - [ ] Images load properly

---

## Monitoring & Maintenance

### Set Up Monitoring
1. Go to Vercel Dashboard → Your Project
2. **Analytics** → Enable to monitor performance
3. **Monitoring** → Set up alerts for errors (optional)

### Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Deployments take ~2-3 minutes
- Failed deployments don't affect production

### Environment Variables
If your app needs secrets (in future):
1. Vercel Dashboard → Settings → Environment Variables
2. Add variables
3. Redeploy for changes to take effect

---

## Troubleshooting

### Build Fails
```bash
# Clear caches and rebuild locally
rm -r node_modules dist .expo
npm install
npm run build
```

### Routes Return 404
- Check that `vercel.json` has rewrite rules
- Verify all files in `app/` directory have routes defined
- Check for typos in `app/` file structure

### Styles Not Loading
- Verify Tailwind CSS build completed
- Check that `.expo/static` folder contains CSS files
- Clear Vercel cache: Dashboard → Settings → Git → Deployments → Clear Cache

### Performance Issues
- Use Vercel Analytics to identify slow routes
- Check bundle sizes with `npm run build` output
- Consider lazy loading components if needed

---

## Live Deployment Details

- **URL Format**: `https://coach-keith-{random}.vercel.app` (free tier)
- **Custom Domain**: Set up in Vercel Dashboard → Settings → Domains
- **Free Tier Limits**:
  - ✅ Unlimited deployments
  - ✅ Unlimited serverless functions (10s timeout)
  - ✅ 100 GB bandwidth/month
  - ✅ Automatic SSL/TLS
  - ⚠️ No database (use external service if needed)

---

## Next Steps

### Phase 1: Web Launch (Current)
- [x] Build Expo web app
- [x] Optimize Vercel configuration
- [ ] Deploy to Vercel

### Phase 2: Custom Domain (Optional)
- [ ] Register domain (Namecheap, GoDaddy, etc.)
- [ ] Point DNS to Vercel
- [ ] Set up in Vercel Dashboard

### Phase 3: Mobile Distribution (Future)
- [ ] Use Expo EAS for Android/iOS builds
- [ ] Distribute APK via Google Play or direct link

### Phase 4: Analytics & Optimization (Optional)
- [ ] Set up Sentry for error tracking
- [ ] Monitor with Vercel Analytics
- [ ] Optimize images and bundle size

---

## Important Notes

🔒 **Security**
- Your project is public on GitHub (suitable for open-source)
- No sensitive keys or credentials in code
- Vercel provides automatic SSL/TLS

📊 **Data Persistence**
- Local SQLite data is per-device/browser
- Data does NOT sync across browsers
- For cloud sync, integrate Firebase/Supabase later

🌐 **Web-Only Features**
- `expo-haptics` won't work on web (graceful fallback)
- `expo-image-picker` limited on web (use browser file API)
- All platform checks in code handle web properly

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Expo Web Docs](https://docs.expo.dev/distribution/publishing-websites/)
- [Expo Router Docs](https://expo.dev/router)
- [React Native Web](https://necolas.github.io/react-native-web/)

---

**Last Updated**: February 11, 2026
**Status**: ✅ Ready for Deployment


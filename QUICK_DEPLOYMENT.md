# 🚀 CoachKeith - Quick Vercel Deployment Guide

## 30-Minute Deployment Plan

This guide will have your app live on Vercel in ~30 minutes.

---

## Part 1: GitHub Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. **Repository name**: `coach-keith`
3. **Description**: `AI Tennis Coaching App - Hybrid Expo + React Native`
4. **Visibility**: Public (required for free Vercel)
5. Click **"Create repository"**

### Step 2: Push Your Code to GitHub
In your terminal (in project directory):

```bash
# Initialize if not already initialized
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CoachKeith app ready for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/coach-keith.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Expected Output**:
```
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Part 2: Vercel Deployment (10 minutes)

### Option A: Deploy via Web UI (Recommended for Beginners)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Click **"Sign Up"**
   - Choose **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub

2. **Add Project to Vercel**
   - Click **"Add New"** → **"Project"**
   - Find and click on `coach-keith` repository
   - Click **"Import"**

3. **Configure Build Settings**
   - **Framework Preset**: Expo (auto-selected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `dist` ✓
   - **Install Command**: `npm install` (default)
   - Click **"Deploy"**

4. **Wait for Deployment**
   - Vercel will build and deploy automatically (~2-3 minutes)
   - You'll see a "Congratulations" message when complete
   - Your app is now live at: `https://coach-keith-xxx.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

**Follow the prompts**:
- Link to existing project or create new? → Create new
- Project name? → coach-keith
- Confirm settings and deploy

---

## Part 3: Test Your Deployment (5 minutes)

### Quick Verification
1. Visit your Vercel URL (e.g., `https://coach-keith-xxx.vercel.app`)
2. Open **DevTools** (F12)
3. Check **Console** tab - should be no red errors
4. Test these routes:
   - `/players` (should load)
   - `/players/create` (should load)
   - `/schedule` (should load)
   - `/analysis` (should load)
   - `/plans` (should load)

### Mobile Testing
1. Open DevTools → **Toggle device toolbar** (Ctrl+Shift+M)
2. Test responsive layout
3. Check that bottom tabs are visible

### Browser Test
- ✅ Check in Chrome
- ✅ Check in Firefox
- ✅ Check on your phone (mobile browser)

---

## Part 4: Custom Domain (Optional - 10 minutes)

### Add Custom Domain
1. Vercel Dashboard → Your Project → **Settings**
2. Go to **Domains**
3. **Add Domain**
4. Enter your domain (e.g., `coachkeith.com`)
5. Follow DNS setup instructions:
   - If domain registered with Vercel → Auto-configured
   - If external registrar → Update nameservers or DNS records
6. DNS propagation takes 24-48 hours

---

## Automatic Deployments

Once connected to GitHub, **every push to `main` triggers deployment**:

```bash
# After making changes locally:
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Builds the app
# 3. Deploys to live URL (within 2-3 minutes)
# 4. Notifies you when complete
```

---

## Troubleshooting Quick Fixes

### Build Failed Error
```bash
# Clear everything and rebuild locally
rm -rf node_modules dist .expo
npm install
npm run build

# If successful locally, push to GitHub
git add .
git commit -m "fix: resolve build issues"
git push origin main
```

### Routes Show 404
- Vercel Dashboard → **Deployments** → **Settings**
- Scroll down → **Git** → **Clear Cache**
- Redeploy by pushing to GitHub again

### Styles Not Loading
- Verify CSS is in `dist/` folder locally
- Run `npm run build` locally to confirm
- If works locally, check Vercel cache (clear above)

### Slow Performance
- Go to Vercel Dashboard → **Analytics**
- Check which routes are slow
- Monitor bundle size in build output

---

## What's Included in Your Deployment

✅ **Free Tier Features**
- Unlimited deployments
- Automatic SSL/TLS certificate
- Global CDN with 35+ edge locations
- Instant rollbacks
- Automatic git integration

✅ **Your App Features**
- 18 static routes pre-rendered
- Responsive design (mobile, tablet, desktop)
- Bottom tab navigation
- Player management screens
- Analysis & scheduling features
- Tailwind CSS styling

⚠️ **Free Tier Limitations**
- Database support: None (use external service like Firebase/Supabase)
- Serverless functions: 10-second timeout
- File uploads: Limited (use Cloudinary, AWS S3, etc.)

---

## Update Your README (Optional)

Add this to your project's GitHub README:

```markdown
## 🌐 Live Demo

Visit the app: [coach-keith-xxx.vercel.app](https://coach-keith-xxx.vercel.app)

### Features
- 📱 Responsive hybrid app (Web, iOS, Android)
- 👥 Player management
- 📊 Performance analysis
- 📅 Schedule management
- 💪 Training plan generation

### Quick Start
```bash
npm install
npm run web  # Start locally
npm run build  # Build for production
```

### Deployment
Automatically deployed on every push to `main` branch via Vercel.
```

---

## Next Steps After Deployment

### Short Term
- [ ] Test all routes on live URL
- [ ] Share link with friends/team
- [ ] Collect feedback
- [ ] Set up GitHub Issues for bugs/features

### Medium Term
- [ ] Add custom domain
- [ ] Set up analytics (Vercel Analytics)
- [ ] Optimize performance
- [ ] Add more features

### Long Term
- [ ] Implement backend API (Firebase/Supabase)
- [ ] Deploy mobile apps (EAS Build)
- [ ] Add user authentication
- [ ] Scale to production tier if needed

---

## Important Files for Deployment

- ✅ `vercel.json` - Vercel configuration (optimized)
- ✅ `package.json` - Dependencies and build script
- ✅ `dist/` - Build output (generated by `npm run build`)
- ✅ `.gitignore` - Excludes node_modules, build files from git

---

## Key Commands Reference

```bash
# Development
npm run web              # Start dev server locally
npm run lint             # Run linter

# Build & Deploy
npm run build            # Build for production (creates dist/)
npm install -g vercel    # Install Vercel CLI
vercel --prod            # Deploy with Vercel CLI

# Troubleshooting
npm install              # Install dependencies
rm -rf node_modules dist # Full clean
git status               # Check git status
git push origin main     # Push changes
```

---

## Questions?

- **Vercel Docs**: https://vercel.com/docs
- **Expo Web Docs**: https://docs.expo.dev/distribution/publishing-websites/
- **GitHub Help**: https://docs.github.com/en

---

**Status**: ✅ Ready for Deployment
**Estimated Time**: 30 minutes from now to live app
**Difficulty**: Beginner-friendly

🎉 **You're ready to go live!**


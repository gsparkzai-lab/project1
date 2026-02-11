# CoachKeith - AI Tennis Coaching App 🎾

This is a premium React Native app built with Expo, designed for AI-powered tennis analysis, training plans, and scheduling.

---

## 🚀 Production Deployment (Free)

To make CoachKeith live for free, follow these steps for **Vercel** (Web) and **Expo EAS** (Mobile):

### 🌐 Web Deployment (Instant & Free)
1. **Build for Web**: Run `npx expo export:web`.
2. **Deploy to Vercel**: 
   - Install Vercel CLI: `npm i -g vercel`.
   - Run `vercel` in the root directory.
   - Follow prompts to link your account and deploy.
   - *Note: The included `vercel.json` ensures your navigation works perfectly on the web.*

### 📱 Mobile Distribution (Free Tier)
1. **Install EAS CLI**: `npm install -g eas-cli`.
2. **Login**: `eas login`.
3. **Configure**: `eas build:configure`.
4. **Build APK (Android)**: `eas build -p android --profile preview`.
   - This creates a shareable link to a real app file that anyone can install on Android for free.

### ✨ Quality Checklist
- [x] **Routing**: Client-side rewrites configured in `vercel.json`.
- [x] **Theme**: Fully integrated primary and secondary color palettes.
- [x] **Responsive**: Styles optimized for both Desktop and Mobile browsers.
- [ ] **Icons**: Upload the generated icons to `assets/images/` before building.

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```powershell
npm install
```

### 2. Start the App (Shortcut)
Just double-click the **`start-server.bat`** file in the root folder. You can choose to start for local use or with a tunnel for internet access.

### 3. Start via Command Line
To run manually:
```powershell
npm run dev
```
*   Press **`w`** in the terminal to open the web version.
*   Once open, you will see the app at `http://localhost:8081`.

---

## 🌐 Accessing the App on the Internet
If you want to share your local project with someone else via a link:

### Method A: Expo Tunnel (Recommended)
This uses Expo's built-in tunneling system. It is the most stable method for development.
1. Stop your server (`Ctrl + C`).
2. Run:
   ```powershell
   npx expo start --tunnel
   ```
3. Use the **`https`** URL provided in the terminal output.

### Method B: ngrok (Universal Web Link)
If you prefer using ngrok directly:
1. Ensure your local server is running on port `8081`.
2. Open a new terminal and run:
   ```powershell
   ngrok http 8081 --host-header="localhost:8081"
   ```
3. Share the **Forwarding** URL provided by ngrok.
   *Note: Using `--host-header="localhost:8081"` is critical to prevent "Invalid Host Header" errors.*

---

## 🛠 Troubleshooting

### PowerShell Execution Policy Error
If you see an error about "running scripts is disabled on this system," run this command once as an Administrator (or in your current terminal):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Server module errors
If you see errors about missing modules (like `xdate`), try cleaning the cache and reinstalling:
```powershell
npm install
npx expo start -c
```

---

## 📱 Features
- **Players Hub**: Manage your tennis squad with colorful profiles.
- **AI Analysis**: Capture video and get instant AI feedback on swing speed and technique.
- **Training Plans**: Generate personalized AI training drills.
- **Scheduler**: Book and manage training sessions with a built-in calendar (3-month window).

Happy Coaching! 🎾

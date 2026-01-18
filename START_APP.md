# 🚀 Start HireSight Application

## Quick Start - See the Preview in 3 Steps

### Step 1: Start the Development Server

Open a terminal in the project root and run:

```bash
npm start
```

You should see:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

### Step 2: Open Web Preview

**Press `w` key** on your keyboard

OR

**Click the link** that says: `› Press w │ open web`

This will automatically open your browser at: **http://localhost:8081**

### Step 3: See the Login Screen

You should see the HireSight login screen with:
- App title
- Email input field
- Password input field
- "Sign In" button
- "Sign Up" link

---

## 🎯 What You Should See

### Login Screen (First View)
```
┌─────────────────────────┐
│    Welcome Back         │
│    HireSight            │
│                         │
│  [Email input]          │
│  [Password input]       │
│                         │
│  [Sign In Button]       │
│                         │
│  Don't have account?    │
│  Sign Up                │
└─────────────────────────┘
```

---

## 🔧 Troubleshooting

### Problem: "Command not found: npm"
**Solution:** Install Node.js from https://nodejs.org

### Problem: Port 8081 already in use
**Solution:**
```bash
# Kill the process on port 8081
# On Mac/Linux:
lsof -ti:8081 | xargs kill -9

# On Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Problem: Web preview won't open
**Solution:**
1. Wait for Metro to fully start (10-15 seconds)
2. Manually open: http://localhost:8081 in your browser
3. Or run: `npm run web`

### Problem: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: Blank white screen
**Solution:**
1. Check browser console (F12) for errors
2. Verify .env file has Supabase credentials
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 📱 Test the Application

### Create a Recruiter Account:
1. Click "Sign Up"
2. Enter:
   - **Name:** Test Recruiter
   - **Email:** test@recruiter.com
   - **Password:** test123456
   - **Role:** Click "Recruiter"
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### Create a Candidate Account:
1. Logout (if logged in)
2. Click "Sign Up"
3. Enter:
   - **Name:** Test Candidate
   - **Email:** test@candidate.com
   - **Password:** test123456
   - **Role:** Click "Candidate"
4. Click "Sign Up"

---

## 🌐 URLs to Access

| Service | URL |
|---------|-----|
| **Frontend (Web)** | http://localhost:8081 |
| **Backend API** | http://localhost:5000 |
| **API Health Check** | http://localhost:5000/api/health |

---

## 📋 Alternative: Direct Web Command

If pressing 'w' doesn't work, run:

```bash
npm run web
```

This directly starts the web version.

---

## ✅ Success Indicators

You'll know it's working when you see:

1. **Terminal shows:**
   ```
   › Metro waiting on exp://...
   › Logs for your project will appear below
   ```

2. **Browser opens automatically** to http://localhost:8081

3. **Login screen appears** with HireSight branding

4. **No red error screens** in the browser

---

## 🚀 Full Stack Development

### Terminal 1: Frontend (This terminal)
```bash
npm start
# Press 'w' for web
```

### Terminal 2: Backend (Open new terminal)
```bash
cd flask-backend
python app.py
```

Now you have:
- ✅ Frontend at http://localhost:8081
- ✅ Backend API at http://localhost:5000
- ✅ Full authentication working
- ✅ Resume parsing ready
- ✅ AI matching ready

---

## 🎨 What to Expect

### For Recruiters:
- Dashboard with analytics
- Resume search with AI filters
- Job management
- Interview scheduling
- Analytics charts

### For Candidates:
- Resume upload
- Job browsing
- AI match scores
- Application tracking
- Interview schedule

---

## 💡 Pro Tips

1. **Keep Metro running** - Don't close the terminal with `npm start`
2. **Use Chrome or Firefox** - Best browser support
3. **Open DevTools (F12)** - See console logs and errors
4. **Hot reload works** - Changes auto-refresh the page
5. **Clear cache** if things look weird - Hard refresh: Ctrl+Shift+R

---

## 📞 Still Can't See Preview?

Try this sequence:

```bash
# 1. Stop any running processes (Ctrl+C in terminals)

# 2. Clear everything
rm -rf node_modules .expo .expo-shared
npm install

# 3. Start fresh
npm start

# 4. Wait 10-15 seconds for Metro to bundle

# 5. Press 'w' or open http://localhost:8081 manually
```

---

## 🎉 You're Ready!

Once you see the login screen, you can:
- ✅ Create accounts (recruiter/candidate)
- ✅ Upload resumes
- ✅ Test AI matching
- ✅ Schedule interviews
- ✅ View analytics

**Happy Testing! 🚀**

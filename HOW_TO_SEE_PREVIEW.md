# 🖥️ How to See the Preview - Step by Step

## Option 1: Quick Start (Recommended)

### Step 1: Open Terminal
Navigate to your project directory:
```bash
cd /tmp/cc-agent/62401612/project
```

### Step 2: Start the Dev Server
```bash
npm start
```

### Step 3: Wait for Metro Bundler
You'll see output like:
```
Starting Metro Bundler
› Metro waiting on exp://192.168.x.x:8081
```

### Step 4: Press 'w' Key
When you see the menu, press the **'w'** key on your keyboard.

This will automatically open your browser to: **http://localhost:8081**

---

## Option 2: Direct Web Start

If Option 1 doesn't work, try this:

```bash
npm run web
```

This directly opens the web version.

---

## Option 3: Manual Browser Open

1. Start the server:
   ```bash
   npm start
   ```

2. Manually open your browser and go to:
   ```
   http://localhost:8081
   ```

---

## ✅ What You Should See

When the preview loads, you should see:

### 1. Login Screen (First View)
- **"Welcome Back"** heading
- **"HireSight"** subtitle
- Email input field
- Password input field
- **"Sign In"** button (blue)
- **"Don't have an account? Sign Up"** link

### 2. Working Features
- Click "Sign Up" → Registration screen appears
- Enter credentials → Can create an account
- After login → Dashboard loads

---

## 🔍 Check If It's Running

Open these URLs in your browser:

1. **Main App:** http://localhost:8081
2. **Check Metro:** http://localhost:8081/_expo/static/favicon.ico

If favicon.ico loads, Metro is running correctly.

---

## 🐛 Troubleshooting

### Problem: Port 8081 Already in Use

**Solution:**
```bash
# Kill any process on port 8081
npx kill-port 8081

# Then restart
npm start
```

### Problem: Blank White Screen

**Solutions:**
1. **Hard refresh:** Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear cache:**
   ```bash
   rm -rf .expo
   npm start
   ```
3. **Check console:** Press `F12` in browser and look for errors

### Problem: "Cannot Connect to Metro"

**Solution:**
```bash
# Stop all processes
pkill -f "expo start"

# Clean install
rm -rf node_modules .expo
npm install

# Restart
npm start
```

### Problem: Module Not Found Errors

**Solution:**
```bash
# Make sure lucide-react-native is installed
npm install lucide-react-native

# Restart
npm start
```

---

## 🎯 Expected Behavior

### Good Signs ✅
- Terminal shows "Metro waiting on exp://..."
- Browser opens automatically
- No red error screens
- Login form visible and functional

### Bad Signs ❌
- Red error screen in browser
- "Cannot connect to Metro" message
- Blank white screen that won't load
- Console shows module errors

---

## 🚀 After Preview Works

### Test the Application:

1. **Create Recruiter Account:**
   - Click "Sign Up"
   - Name: Test Recruiter
   - Email: recruiter@test.com
   - Password: test123456
   - Role: **Recruiter** (click button)
   - Sign Up

2. **Create Candidate Account:**
   - Logout
   - Click "Sign Up"
   - Name: Test Candidate
   - Email: candidate@test.com
   - Password: test123456
   - Role: **Candidate** (click button)
   - Sign Up

3. **Explore Features:**
   - **Recruiter:** See Dashboard, Search tabs
   - **Candidate:** See Dashboard, Jobs tabs

---

## 📱 Development Workflow

### Terminal 1: Frontend (Keep Running)
```bash
npm start
```

### Terminal 2: Backend API (Optional - for full functionality)
```bash
cd flask-backend
python app.py
```

Now you have:
- ✅ Frontend at http://localhost:8081
- ✅ Backend API at http://localhost:5000

---

## 💡 Pro Tips

1. **Keep Terminal Open:** Don't close the terminal running `npm start`
2. **Use Chrome:** Best compatibility for React Native Web
3. **DevTools:** Press F12 to see console logs and errors
4. **Hot Reload:** Changes auto-refresh (no need to restart)
5. **Network Tab:** Check if API calls are working (F12 → Network)

---

## 🎨 What Each Screen Looks Like

### Login Screen
```
┌──────────────────────────────┐
│                              │
│      Welcome Back            │
│      HireSight               │
│                              │
│   ┌────────────────────┐     │
│   │ Email              │     │
│   └────────────────────┘     │
│                              │
│   ┌────────────────────┐     │
│   │ Password           │     │
│   └────────────────────┘     │
│                              │
│   ┌────────────────────┐     │
│   │    Sign In         │     │
│   └────────────────────┘     │
│                              │
│   Don't have an account?     │
│   Sign Up                    │
│                              │
└──────────────────────────────┘
```

### Registration Screen
```
┌──────────────────────────────┐
│    Create Account            │
│    Join HireSight            │
│                              │
│   [Full Name]                │
│   [Email]                    │
│   [Password]                 │
│                              │
│   I am a:                    │
│   [Candidate] [Recruiter]    │
│                              │
│   [Sign Up Button]           │
│                              │
│   Already have account?      │
│   Sign In                    │
└──────────────────────────────┘
```

---

## 🆘 Still Not Working?

Try this complete reset:

```bash
# 1. Stop everything
pkill -f "expo start"
pkill -f "metro"

# 2. Clean everything
rm -rf node_modules .expo .expo-shared
rm -rf ios/build android/build

# 3. Fresh install
npm install

# 4. Clear cache and start
npm start -- --clear

# 5. Wait 15-20 seconds for bundling

# 6. Press 'w' or manually open http://localhost:8081
```

---

## ✅ Success Checklist

- [ ] Terminal shows "Metro waiting..."
- [ ] Browser opens to http://localhost:8081
- [ ] Login screen visible
- [ ] No red error screens
- [ ] Can click "Sign Up" button
- [ ] Registration form appears
- [ ] Console has no critical errors (F12)

---

## 🎉 You're Ready!

Once you see the login screen:
1. Create test accounts (recruiter and candidate)
2. Upload resumes
3. Test AI matching
4. Explore all features

**The app is fully functional and ready to use!** 🚀

# 🔧 Login Troubleshooting Guide - TravelCircles

## ❌ **Issue: "Failed to fetch" when logging in**

This error typically occurs when the API server is not running or there's a connection issue.

## ✅ **Step-by-Step Fix:**

### **Step 1: Start Both Servers**

**Open TWO separate terminal/command prompt windows:**

**Terminal 1 - API Server:**
```bash
cd "D:\Delete folder-C\web develpment\Main projects\TravelCircles\apps\api"
npm run dev
```

**Terminal 2 - Web Server:**
```bash
cd "D:\Delete folder-C\web develpment\Main projects\TravelCircles\apps\web"
npm run dev
```

### **Step 2: Verify Servers Are Running**

**Check API Server:**
- Open: http://localhost:3001/health
- Should show: `{"success": true, "message": "TravelCircles API is running!"}`

**Check Web Server:**
- Open: http://localhost:3000
- Should show: TravelCircles homepage

### **Step 3: Test Login Credentials**

**Working Credentials:**
```
User Account:
Email: vivek@example.com
Password: password123

Admin Account:
Email: admin@travelcircles.com
Password: admin123
```

### **Step 4: Check Browser Console**

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try logging in
4. Look for any error messages

**Common Errors & Solutions:**

**Error: "CORS policy"**
- **Solution:** Make sure API server is running on port 3001

**Error: "Network Error"**
- **Solution:** Check if API server is accessible at http://localhost:3001

**Error: "404 Not Found"**
- **Solution:** Verify API routes are working

### **Step 5: Manual Server Start (If Automated Fails)**

**If npm run dev doesn't work, try:**

**For API Server:**
```bash
cd apps\api
npm install
npx ts-node src/index.ts
```

**For Web Server:**
```bash
cd apps\web
npm install
npm run build
npm start
```

### **Step 6: Alternative Testing Method**

**Test API directly with curl:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vivek@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt-token-here"
  }
}
```

## 🔍 **Debugging Checklist:**

### **API Server Issues:**
- [ ] Port 3001 is not in use by another application
- [ ] All dependencies are installed (`npm install`)
- [ ] No TypeScript compilation errors
- [ ] Environment variables are set correctly

### **Web Server Issues:**
- [ ] Port 3000 is not in use by another application
- [ ] All dependencies are installed (`npm install`)
- [ ] No build errors
- [ ] API_URL is set correctly in environment

### **Network Issues:**
- [ ] Firewall is not blocking ports 3000/3001
- [ ] Antivirus is not interfering
- [ ] No proxy settings blocking localhost

## 🚀 **Quick Fix Commands:**

**Reset Everything:**
```bash
# Stop all Node processes
taskkill /f /im node.exe

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd apps\api && npm install
cd ..\web && npm install

# Start servers
cd ..\api && npm run dev
# In new terminal:
cd apps\web && npm run dev
```

## 📱 **Test on Different Browser:**

If login fails on one browser, try:
- Chrome (Incognito mode)
- Firefox
- Edge
- Clear browser cache and cookies

## 🎯 **Expected Behavior:**

**When login works correctly:**
1. Enter: `vivek@example.com` / `password123`
2. Click "Sign In"
3. Should redirect to dashboard
4. Should show user name in header
5. Should have access to booking features

## 📞 **Still Having Issues?**

**Check these files for any syntax errors:**
- `apps/api/src/services/userService.ts`
- `apps/api/src/routes/auth.ts`
- `apps/web/src/contexts/AuthContext.tsx`

**Common File Issues:**
- Missing commas in JSON
- Incorrect import statements
- TypeScript type errors
- Missing environment variables

## ✅ **Success Indicators:**

**API Server Running:**
- Terminal shows: "🚀 Server running on port 3001"
- http://localhost:3001/health returns JSON

**Web Server Running:**
- Terminal shows: "Ready in X.Xs"
- http://localhost:3000 loads homepage

**Login Working:**
- No "Failed to fetch" error
- Redirects to dashboard after login
- User menu appears in header

## 🎉 **Final Test:**

Once both servers are running:
1. Go to: http://localhost:3000/login
2. Enter: `vivek@example.com` / `password123`
3. Click "Sign In"
4. Should redirect to: http://localhost:3000/dashboard
5. Should show: "Welcome, Vivek Kumar"

**If this works, the platform is ready to use!** 🚀

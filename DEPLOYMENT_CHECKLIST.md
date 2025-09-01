# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### ✅ Files Created/Updated:
- [x] `api/index.js` - Serverless function entry point
- [x] `vercel.json` - Vercel configuration
- [x] `client/vite.config.js` - Updated for Vercel
- [x] `client/.env.production` - Production environment
- [x] `server.js` - Updated to export app
- [x] `package.json` - Added Vercel scripts
- [x] `client/package.json` - Added vercel-build script
- [x] `client/src/api/apiSlice.js` - Updated API base URL
- [x] `.gitignore` - Added Vercel files

### ✅ Build Test:
- [x] Client builds successfully (`npm run build` in client folder)
- [x] No critical build errors
- [x] Assets generated in `client/dist`

## Deployment Steps

### Step 1: MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster (free tier)
- [ ] Create database user with admin privileges
- [ ] Whitelist all IPs (0.0.0.0/0) for Vercel
- [ ] Get connection string

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 3: Vercel Deployment
- [ ] Go to vercel.com/dashboard
- [ ] Click "New Project"
- [ ] Import GitHub repository
- [ ] Configure build settings:
  - Framework: Other
  - Build Command: `cd client && npm install && npm run build`
  - Output Directory: `client/dist`
  - Install Command: `npm install`

### Step 4: Environment Variables
Add these in Vercel → Settings → Environment Variables:

**Required:**
- [ ] `MONGO_URI` = `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/student-productivity?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` = `[32+ character random string]`
- [ ] `JWT_REFRESH_SECRET` = `[32+ character random string]`
- [ ] `NODE_ENV` = `production`

**Optional (for email features):**
- [ ] `EMAIL_HOST` = `smtp.gmail.com`
- [ ] `EMAIL_PORT` = `587`
- [ ] `EMAIL_USER` = `your-email@gmail.com`
- [ ] `EMAIL_PASS` = `your-app-password`

### Step 5: Deploy & Test
- [ ] Click "Deploy" in Vercel
- [ ] Wait for deployment to complete
- [ ] Test deployed application:
  - [ ] Homepage loads
  - [ ] User registration works
  - [ ] User login works
  - [ ] Tasks functionality works
  - [ ] Calendar functionality works
  - [ ] Pomodoro timer works
  - [ ] Notes functionality works
  - [ ] API endpoints respond correctly

## Post-Deployment

### Monitoring
- [ ] Check Vercel function logs for errors
- [ ] Monitor MongoDB Atlas for connections
- [ ] Test all user flows
- [ ] Check performance metrics

### Security
- [ ] Verify environment variables are not exposed
- [ ] Test rate limiting
- [ ] Verify CORS settings
- [ ] Check JWT token functionality

### Optional Enhancements
- [ ] Add custom domain
- [ ] Set up monitoring/alerts
- [ ] Configure analytics
- [ ] Set up error tracking

## Troubleshooting

### Common Issues:
1. **Build fails**: Check package.json dependencies
2. **API not working**: Verify environment variables
3. **Database connection fails**: Check MongoDB Atlas whitelist and connection string
4. **JWT errors**: Ensure secrets are 32+ characters
5. **CORS errors**: Check API configuration in `api/index.js`

### Debug Commands:
```bash
# Test local build
cd client && npm run build

# Check API locally
npm run dev

# View Vercel logs
vercel logs [deployment-url]
```

## Success Criteria ✅
- [ ] Application deploys without errors
- [ ] All features work in production
- [ ] Database operations function correctly
- [ ] Authentication system works
- [ ] No console errors in browser
- [ ] API responses are correct
- [ ] Performance is acceptable

## Your Deployment URL
After successful deployment, your app will be available at:
`https://[your-project-name].vercel.app`

---

**Need Help?** Check the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or create an issue in the repository.
# Vercel Deployment Guide - Student Productivity Dashboard

## Step-by-Step Deployment Instructions

### Prerequisites
1. GitHub account
2. Vercel account (free at vercel.com)
3. MongoDB Atlas account (free at mongodb.com/atlas)

### Step 1: Setup MongoDB Atlas
1. Go to https://www.mongodb.com/atlas
2. Create free account and cluster
3. Create database user:
   - Database Access → Add New Database User
   - Username: `admin` Password: `[generate strong password]`
   - Built-in Role: `Atlas admin`
4. Whitelist IP addresses:
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy connection string: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `cd client && npm install && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

### Step 4: Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

**Required Variables:**
```
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/student-productivity?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_32_characters_long
NODE_ENV=production
```

**Optional Variables:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at: `https://your-project-name.vercel.app`

### Step 6: Test Deployment
1. Visit your deployed URL
2. Test user registration
3. Test login functionality
4. Test all features (tasks, calendar, pomodoro, notes)

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json files
- Verify environment variables are set correctly

### API Errors
- Check function logs in Vercel dashboard → Functions tab
- Verify MongoDB connection string
- Ensure JWT secrets are set and are long enough (32+ characters)

### Frontend Issues
- Check browser console for errors
- Verify API calls are using relative paths (/api/...)
- Check if build output exists in client/dist

## Local Development
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Start development
npm run dev
```

## Production Testing
```bash
# Build and test locally
npm run build
cd client && npm run preview
```

## Custom Domain (Optional)
1. Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CLIENT_URL environment variable if needed

## Security Notes
- Never commit .env files to Git
- Use strong, unique JWT secrets (32+ characters)
- Regularly rotate secrets
- Monitor function logs for suspicious activity
- Keep dependencies updated
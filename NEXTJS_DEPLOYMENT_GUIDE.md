# Next.js Deployment Guide - Student Productivity Dashboard

This guide covers deploying the Next.js version of the Student Productivity Dashboard to various platforms.

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Local Development Setup

1. **Clone and setup the project**
   ```bash
   git clone https://github.com/Ronakmalam333/Student-Productivity-Dashboard-Application.git
   cd Student-Productivity-Dashboard-Application
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install Next.js client dependencies**
   ```bash
   npm run install-nextjs-client
   ```

4. **Environment Configuration**
   
   **Backend (.env)**
   ```env
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/student-productivity
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   CLIENT_URL=http://localhost:3000
   ```
   
   **Next.js Client (nextjs-client/.env)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start both backend and frontend**
   ```bash
   npm run dev-nextjs
   ```
   
   Or separately:
   ```bash
   # Backend (Terminal 1)
   npm run server
   
   # Next.js Client (Terminal 2)
   npm run nextjs-client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Production Deployment

### Option 1: Vercel (Recommended for Next.js)

#### One-Click Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Student-Productivity-Dashboard-Application&project-name=student-productivity-dashboard&repository-name=student-productivity-dashboard)

#### Manual Deployment

1. **Prepare your repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Backend to Railway/Render**
   - Create account on Railway.app or Render.com
   - Connect your GitHub repository
   - Set environment variables:
     ```env
     NODE_ENV=production
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student-productivity
     JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
     JWT_REFRESH_SECRET=your_super_secure_refresh_secret_32_chars_min
     CLIENT_URL=https://your-vercel-app.vercel.app
     ```
   - Deploy from root directory

3. **Deploy Frontend to Vercel**
   - Create account on Vercel.com
   - Import your GitHub repository
   - Set Root Directory to `nextjs-client`
   - Set environment variables:
     ```env
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
     ```
   - Deploy

### Option 2: Netlify + Railway

#### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables
3. Deploy from root directory

#### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build settings:
   - Base directory: `nextjs-client`
   - Build command: `npm run build`
   - Publish directory: `nextjs-client/.next`
3. Set environment variables
4. Deploy

### Option 3: Self-Hosted (VPS/Cloud)

#### Server Requirements
- Ubuntu 20.04+ or similar
- Node.js 16+
- MongoDB
- Nginx (recommended)
- PM2 (process manager)

#### Setup Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/YOUR_USERNAME/Student-Productivity-Dashboard-Application.git
   cd Student-Productivity-Dashboard-Application
   
   # Install dependencies
   npm install
   cd nextjs-client && npm install && npm run build
   cd ..
   
   # Setup environment variables
   cp .env.example .env
   # Edit .env with your production values
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/student-dashboard
   server {
       listen 80;
       server_name your-domain.com;
   
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   
       # Next.js Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable and Start Services**
   ```bash
   sudo ln -s /etc/nginx/sites-available/student-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

## 🔧 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your_super_secure_jwt_secret_here` |
| `JWT_REFRESH_SECRET` | JWT refresh secret (32+ chars) | `your_super_secure_refresh_secret` |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `EMAIL_HOST` | SMTP host (optional) | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port (optional) | `587` |
| `EMAIL_USER` | SMTP username (optional) | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password (optional) | `your-app-password` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-api.railway.app/api` |

## 📊 Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Create free account and cluster

2. **Configure Database**
   - Create database: `student-productivity`
   - Create user with read/write permissions
   - Whitelist your deployment IP addresses

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student-productivity?retryWrites=true&w=majority
   ```

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

## 🔒 Security Checklist

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper firewall rules
- [ ] Regular security updates
- [ ] Monitor application logs

## 📈 Performance Optimization

### Next.js Optimizations
- [ ] Enable Image Optimization
- [ ] Use Next.js built-in caching
- [ ] Implement proper loading states
- [ ] Optimize bundle size
- [ ] Enable compression

### Backend Optimizations
- [ ] Database indexing
- [ ] API response caching
- [ ] Connection pooling
- [ ] Rate limiting
- [ ] Compression middleware

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CLIENT_URL` in backend environment
   - Verify frontend URL matches exactly

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network access in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

4. **Authentication Issues**
   - Check JWT secret configuration
   - Verify token storage in frontend
   - Check API endpoint URLs

### Logs and Monitoring

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Application logs
tail -f logs/combined.log
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Open an issue on GitHub with:
   - Deployment platform
   - Error messages
   - Environment details

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd nextjs-client && npm install

# Rebuild frontend
npm run build-nextjs

# Restart services
pm2 restart all
```

### Backup Strategy

1. **Database Backups**
   - MongoDB Atlas: Automatic backups enabled
   - Self-hosted: Regular mongodump backups

2. **Application Backups**
   - Git repository as source of truth
   - Environment variables backup
   - SSL certificates backup

This completes the comprehensive deployment guide for the Next.js version of the Student Productivity Dashboard.
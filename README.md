# Student Productivity Dashboard

A comprehensive MERN stack application for student productivity management featuring task tracking, calendar integration, Pomodoro timer, and note-taking capabilities.

## 🚀 Features

- **Task Management**: Create, organize, and track tasks with priority levels
- **Calendar Integration**: Schedule and manage events with calendar view
- **Pomodoro Timer**: Focus sessions with productivity tracking
- **Notes & Journal**: Rich text editor for notes and journal entries
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-friendly Material-UI interface
- **Dual Frontend**: Choose between React (Vite) or Next.js versions

## 🛠️ Tech Stack

**Frontend Options:**

*React Version (client/):*
- React 18 with Vite
- Material-UI (MUI) for components
- Redux Toolkit for state management
- React Router for navigation
- Formik & Yup for form handling

*Next.js Version (nextjs-client/):*
- Next.js 14 with App Router
- Material-UI (MUI) for components
- Redux Toolkit with RTK Query
- Next.js routing
- Formik & Yup for form handling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Helmet for security
- Rate limiting and CORS protection

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ronakmalam333/Student-Productivity-Dashboard-Application.git
   cd Student-Productivity-Dashboard-Application
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/student-productivity
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   CLIENT_URL=http://localhost:5173
   ```

5. **Choose your frontend and start the application**
   
   **Option A: React Version (Original)**
   ```bash
   npm run dev
   ```
   
   **Option B: Next.js Version (Recommended)**
   ```bash
   npm run dev-nextjs
   ```
   
   Or start components separately:
   ```bash
   # Backend only
   npm run server
   
   # React frontend (in client directory)
   cd client && npm run dev
   
   # Next.js frontend (in nextjs-client directory)
   cd nextjs-client && npm run dev
   ```

## 🚀 Deployment

### Deployment Options

**Next.js Version (Recommended):**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Student-Productivity-Dashboard-Application)

📖 **Next.js Guide**: [NEXTJS_DEPLOYMENT_GUIDE.md](./NEXTJS_DEPLOYMENT_GUIDE.md)

**React Version:**

📖 **React Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Manual Production Build

1. **Build frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start production server**
   ```bash
   NODE_ENV=production npm start
   ```

### Environment Variables

**Required:**
- `MONGO_URI` (MongoDB connection string)
- `JWT_SECRET` (strong secret key, 32+ characters)
- `JWT_REFRESH_SECRET` (strong refresh secret, 32+ characters)
- `NODE_ENV=production`

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Dashboard**: View overview of tasks, events, and productivity stats
3. **Tasks**: Create and manage your to-do items
4. **Calendar**: Schedule and view events
5. **Pomodoro**: Start focus sessions and track productivity
6. **Notes**: Create notes and journal entries

## 🎯 Quick Setup

**For Next.js Version:**
```bash
# Windows
setup-nextjs.bat

# Linux/macOS
./setup-nextjs.sh
```

**For React Version:**
```bash
# Follow the installation steps above
npm run dev
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

None currently. Please report any bugs in the Issues section.

## 📞 Support

For support, please open an issue in the GitHub repository.

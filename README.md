# Student Productivity Dashboard

A comprehensive MERN stack application for student productivity management featuring task tracking, calendar integration, Pomodoro timer, and note-taking capabilities.

## 🚀 Features

- **Task Management**: Create, organize, and track tasks with priority levels
- **Calendar Integration**: Schedule and manage events with calendar view
- **Pomodoro Timer**: Focus sessions with productivity tracking
- **Notes & Journal**: Rich text editor for notes and journal entries
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-friendly Material-UI interface

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Material-UI (MUI) for components
- Redux Toolkit for state management
- React Router for navigation
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

5. **Start the application**
   
   Development mode (both frontend and backend):
   ```bash
   npm run dev
   ```
   
   Or separately:
   ```bash
   # Backend only
   npm run server
   
   # Frontend only (in client directory)
   cd client && npm run dev
   ```

## 🚀 Deployment

### One-Click Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/Student-Productivity-Dashboard-Application)

**Quick Setup:**
1. Click deploy button above
2. Connect GitHub account
3. Set environment variables in Vercel:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Secure secret (32+ characters)
   - `JWT_REFRESH_SECRET`: Secure refresh secret (32+ characters)
   - `NODE_ENV`: production
4. Deploy!

📖 **Detailed Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

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

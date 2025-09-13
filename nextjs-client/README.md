# Student Productivity Dashboard - Full Stack Next.js

A complete MERN stack application built with Next.js, featuring task management, calendar integration, Pomodoro timer, and note-taking capabilities.

## 🚀 Features

- **Task Management**: Create, organize, and track tasks with priority levels
- **Calendar Integration**: Schedule and manage events with calendar view
- **Pomodoro Timer**: Focus sessions with productivity tracking
- **Notes & Journal**: Rich text editor for notes and journal entries
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-friendly Material-UI interface

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 with App Router
- Material-UI (MUI) for components
- Redux Toolkit with RTK Query
- Formik & Yup for form handling

**Backend:**
- Next.js API Routes
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-productivity
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_here
   JWT_EXPIRE=1h
   JWT_REFRESH_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_EXPIRE`
   - `JWT_REFRESH_EXPIRE`

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

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
- Secure HTTP-only cookies
- Input validation and sanitization

## 📄 API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get tasks
- `POST /api/events` - Create event
- `GET /api/events` - Get events
- `POST /api/notes` - Create note
- `GET /api/notes` - Get notes
- `POST /api/pomodoro/start` - Start pomodoro session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
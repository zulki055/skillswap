# SkillSwap

A comprehensive skill-sharing platform where users can exchange knowledge, schedule learning sessions, and build their reputation through skill-based interactions.

## Features

- **User Authentication**: Secure registration and login system
- **Skill Matching**: Find users with complementary skills to teach/learn
- **Swap Requests**: Send and manage skill exchange proposals
- **Real-time Chat**: Communicate with other users via integrated chat system
- **Session Scheduling**: Book and manage learning sessions with Google Meet integration
- **Credit System**: Earn and spend skill credits for transactions
- **Review System**: Rate and review completed skill exchanges
- **Admin Panel**: Comprehensive admin dashboard for user and system management
- **Progress Tracking**: Monitor skill development and session completion

## Tech Stack

### Frontend
- React 18.2.0
- Vite (build tool)
- Lucide React (icons)
- Socket.io-client (real-time communication)

### Backend
- Node.js with Express
- MongoDB (local database)
- Socket.io (real-time features)
- Mongoose (ODM)
- bcryptjs (password hashing)
- nodemailer (email functionality)
- CORS support

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v8.0) - Install via Homebrew:
  ```bash
  brew install mongodb/brew/mongodb-community@8.0
  brew services start mongodb/brew/mongodb-community@8.0
  ```

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**:
   - The backend uses a `.env` file with the following variables:
     ```
     PORT=5000
     CLIENT_URL=http://localhost:5173
     MONGODB_URI=mongodb://localhost:27017/skillswap
     ```

## Running the Application

### Development Mode

1. **Start MongoDB** (if not already running):
   ```bash
   brew services start mongodb/brew/mongodb-community@8.0
   ```

2. **Start the backend server**:
   ```bash
   cd backend
   node server.js
   ```
   The backend will run on `http://localhost:5000`

3. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

4. **Access the application**:
   - Open your browser and navigate to `http://localhost:5173`
   - Default admin credentials: `admin@skillswap.com` / `admin123`

### Production Build

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the built files** (the backend can serve static files if configured)

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `PUT /api/admin/users/:id/password` - Admin password reset
- `PUT /api/users/:id/change-password` - User password change

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id/skills` - Update user skills

### Matching
- `GET /api/matching/users` - Get potential skill matches
- `POST /api/matching/request` - Send skill swap request

### Swap Requests
- `GET /api/users/:userId/swap-requests` - Get user's swap requests
- `PUT /api/swap-requests/:requestId` - Update swap request status

### Credits & Transactions
- `GET /api/users/:userId/transactions` - Get user transactions
- `GET /api/users/:userId/credit-stats` - Get user credit statistics

### Chat
- `GET /api/users/:userId/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:chatId/messages` - Get chat messages
- `POST /api/chats/:chatId/messages` - Send message

### Sessions
- `POST /api/sessions` - Schedule new session
- `GET /api/users/:userId/sessions` - Get user sessions
- `PUT /api/sessions/:sessionId/complete` - Mark session as complete

### Progress Tracking
- `GET /api/skill-progress/check` - Check skill progress
- `GET /api/skill-progress/:swapRequestId` - Get progress for specific swap

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/users/:userId/reviews` - Get user reviews
- `GET /api/reviews/all` - Get all reviews
- `GET /api/users/:userId/given-reviews` - Get reviews given by user
- `GET /api/users/:userId/can-review/:targetUserId` - Check if user can review another

### Admin (Admin only)
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/stats` - Get system statistics
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `PUT /api/admin/users/:id/skills` - Update user skills (admin)
- `GET /api/admin/skills/all` - Get all skills
- `POST /api/admin/skills/remove` - Remove skill
- `GET /api/admin/transactions/all` - Get all transactions
- `GET /api/admin/reports` - Get system reports
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings` - Update admin settings

## Project Structure

```
skillswap/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── models/
│   │   └── User.js              # User data model
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Main server file
│   └── test.js                  # Test file
├── frontend/
│   ├── public/
│   │   └── images/              # Static images
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Admin panel components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── chat/            # Chat system components
│   │   │   ├── credits/         # Credit system components
│   │   │   ├── matching/        # Skill matching components
│   │   │   ├── profile/         # User profile components
│   │   │   ├── Requests/        # Swap request components
│   │   │   └── reviews/         # Review system components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service functions
│   │   └── styles/              # CSS styles
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
├── package.json                 # Root package file
├── README.md                    # This file
└── users.html                   # Static HTML file
```

## Default Admin Account

- **Email**: admin@skillswap.com
- **Password**: admin123

Use these credentials to access the admin panel and manage the system.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact the development team or create an issue in the repository.
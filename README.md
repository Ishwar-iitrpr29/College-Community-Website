# College Community Platform

A comprehensive platform designed for college students to share study materials, interview experiences, job opportunities, and collaborate in groups.

## Features

### Authentication System
- Two-step signup process with email verification
- Login via password or OTP
- Password recovery system
- JWT-based authentication
- Unique username and email validation

### Core Features
1. **Material Sharing**
   - Upload and share assignments, tutorials, and study materials
   - File categorization by course code, year, and semester
   - Upvote/downvote system
   - Comment functionality
   - Cloud storage integration

2. **Interview and Placement Section**
   - Share interview experiences
   - Document interview questions and answers
   - Track placement records
   - Access senior placement information
   - DSA resources repository

3. **Job Search Integration**
   - LinkedIn API integration for job listings
   - Real-time job updates
   - Job filtering and search capabilities

4. **Group Collaboration**
   - Create topic-specific groups
   - Real-time messaging
   - Group management features
   - File sharing within groups

5. **Smart Notification Center**
   - Real-time updates for new content and activities
   - RL-based content ranking system (mdp_ranking.py)
   - Personalized notification weights based on:
     - User preferences and interests
     - Time spent on different sections
     - Interaction patterns
     - Content relevance
   - Dynamic update scheduling
   - User activity tracking and analysis
   - Adaptive learning of user preferences

## Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: SQLAlchemy 2.0.21
- **Authentication**: Flask-JWT-Extended 4.5.2
- **File Storage**: Cloudinary
- **Email**: secure-smtplib
- **API Documentation**: Flasgger
- **Testing**: pytest, pytest-flask
- **Machine Learning**: Custom RL implementation for notification ranking

### Frontend
- **Framework**: React 18.2.0
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Project Structure

```
.
├── app.py                 # Main Flask application
├── models.py             # Database models
├── mdp_ranking.py        # MDP ranking system implementation
├── app_updates.py        # Application update management
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── instance/             # Database instance
├── uploads/             # File upload directory
└── my-app/              # React frontend
    ├── src/             # React source code
    ├── public/          # Static assets
    └── package.json     # Node.js dependencies
```

## Database Schema

The application uses several key models:
- User: Authentication and profile management
- Upload: Study material management
- Comment: Material discussion
- Vote: Content rating system
- Placement: Placement records
- InterviewExperience: Interview documentation
- Classroom: Group management
- UserPreference: Personalized content delivery
- UserStateTransition: Tracks user state changes for RL
- UpdateInteraction: Records user interactions with notifications

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables in `.env`:
   ```
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Database Configuration
   DATABASE_URL=sqlite:///database.db

   # Flask Configuration
   FLASK_APP=app.py
   FLASK_ENV=development
   FLASK_DEBUG=1

   # Email Configuration
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   ```

   Note: For Gmail, you'll need to:
   1. Enable 2-factor authentication
   2. Generate an App Password
   3. Use the App Password in EMAIL_PASSWORD

4. Start the application:
   ```bash
   python app.py
   ```
   
   The database will be automatically initialized when the application starts.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `/apidocs` when running the application. It includes detailed information about all endpoints, request/response formats, and authentication requirements.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email verification system
- Secure file upload handling
- CORS protection
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the terms specified in the LICENSE file.

## Contact

For any queries or support, please contact the development team. 
 

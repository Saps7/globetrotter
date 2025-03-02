# Globetrotter Quiz

Globetrotter Quiz is a full-stack MERN application that tests users on geographical destinations. Users can register (or login), take a 5-question quiz, compare scores with an inviter (if an invitation link was used), and share their results on social media (e.g., WhatsApp).

---

## Table of Contents

- [Setup and Running](#setup-and-running)
- [Features](#features)
- [User Flow](#user-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
  - [User Endpoints](#user-endpoints)
  - [Destination Endpoints](#destination-endpoints)
- [Future Enhancements](#future-enhancements)

---

## Setup and Running

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globetrotter.git
cd globetrotter
```

2. Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```properties
PORT=5000
MONGODB_URI=mongodb://localhost:27017/globetrotter
```

4. Seed the database with destinations (optional):
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will start running on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```properties
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will start running on http://localhost:5173

### Running in Development Mode

1. Make sure MongoDB is running locally:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or check if MongoDB is running
mongo
```

2. Run both servers:
- Backend: `npm run dev` (in /backend directory)
- Frontend: `npm run dev` (in /frontend directory)

### Building for Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The built files will be in the `dist` directory

### Available Scripts

Backend:
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run seed`: Seed the database with initial destinations

Frontend:
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

### Troubleshooting

1. If MongoDB connection fails:
   - Ensure MongoDB is running
   - Check MongoDB connection string in backend `.env`
   - Try using MongoDB Atlas instead of local installation

2. If API calls fail:
   - Verify backend is running
   - Check VITE_API_BASE_URL in frontend `.env`
   - Ensure ports are not blocked by firewall

3. For port conflicts:
   - Backend: Change PORT in backend `.env`
   - Frontend: Use `--port` flag with `npm run dev`

## Features

- **User Registration/Login**  
  Toggle between login and signup.  
  - Users can register or log in using their username.
  - Optionally, an inviter's ID passed via the URL will fetch and display the inviter’s score as a challenge.

- **Quiz Flow**  
  - Users answer 5 questions on destinations.
  - Each question loads randomly with its set of options.
  - A loader is shown until all options are shuffled and ready.
  - Feedback is given for each question before proceeding.

- **Score System and Comparison**  
  - Displays the current score during the quiz.
  - Upon quiz completion, the final score is shown along with the inviter’s score (if available).
  - A dynamic message congratulates the user or encourages improvement based on a score comparison.
  - Confetti animation is triggered if the user beats the inviter’s score.

- **Sharing Results**  
  - Allows users to share their results on WhatsApp.
  - The share link contains the user’s ID (and preserves any existing invitation parameters).

- **Logout**  
  - A logout button that clears the user information and reloads the app to return to the registration screen.

---

## User Flow

1. **Arrival and Registration/Login**  
   - A new user visits the app URL, possibly with an `inviterId` passed as a query parameter.
   - The User Registration page lets the user choose between login and signup.
   - If an inviter is present, a challenge popup displays the inviter’s score to beat.

2. **Taking the Quiz**  
   - The user starts the quiz which consists of 5 random questions.
   - Each question is loaded with a brief loader until its options are ready.

3. **Feedback and Completion**  
   - After each question, the Feedback modal shows whether the answer was correct.
   - On answering the 5th question and closing the feedback popup, a Completion Modal is shown.
   - The Completion Modal displays:
     - The user's final score.
     - A comparison with the inviter’s score (if available) along with:
       - A congratulatory message and confetti if the user won.
       - A tie or loss message if applicable.
   - The user can then restart the quiz or share their result.

4. **Sharing and Logout**  
   - Results can be shared on WhatsApp using the share button provided.
   - The Logout button reloads the app to the registration view.

---

## Tech Stack

- **Frontend:** React, Vite, Emotion (CSS-in-JS), Framer Motion, React Confetti  
- **Backend:** Node.js, Express, MongoDB (Mongoose)

---


---

## API Documentation

### User Endpoints

#### **POST** `/api/users/signup`
- **Description:** Create a new user.
- **Request Body:**
```json
{
  "username": "exampleUser",
  "inviterId": "optional_inviter_id"
}
```
- **Response:**
  - **201 Created**
  ```json
  {
    "_id": "user_id",
    "username": "exampleUser",
    "score": { "correct": 0, "total": 0 },
    "createdAt": "2025-03-02T12:34:56.789Z"
  }
  ```
  - **400 Bad Request** if username already exists or validation fails

#### **POST** `/api/users/login`
- **Description:** Authenticate an existing user.
- **Request Body:**
```json
{
  "username": "exampleUser",
  "inviterId": "optional_inviter_id"
}
```
- **Response:**
  - **200 OK**
  ```json
  {
    "_id": "user_id",
    "username": "exampleUser",
    "score": { "correct": 0, "total": 0 },
    "createdAt": "2025-03-02T12:34:56.789Z"
  }
  ```
  - **404 Not Found** if username does not exist

#### **GET** `/api/users/:id`
- **Description:** Retrieve user details by ID.
- **Response:**
  - **200 OK**
  ```json
  {
    "_id": "user_id",
    "username": "exampleUser",
    "score": { "correct": 3, "total": 5 }
  }
  ```
  - **404 Not Found** if user not found

#### **PATCH** `/api/users/:id`
- **Description:** Update user score.
- **Request Body:**
```json
{
  "score": {
    "correct": 4,
    "total": 5
  }
}
```
- **Response:**
  - **200 OK**
  ```json
  {
    "_id": "user_id",
    "username": "exampleUser",
    "score": { "correct": 4, "total": 5 }
  }
  ```
  - **400 Bad Request** if validation fails

### Destination Endpoints

#### **GET** `/api/destinations`
- **Description:** Retrieve list of all destinations.
- **Response:**
  - **200 OK**
  ```json
  [
    {
      "_id": "destination_id",
      "city": "Paris",
      "clues": ["City of Light"],
      "fun_fact": ["Known for its art, fashion, and culture"],
      "trivia": ["Home to the Eiffel Tower"]
    },
    {
      "_id": "destination_id2",
      "city": "Tokyo",
      "clues": ["Land of the Rising Sun"],
      "fun_fact": ["A mix of traditional and modern"],
      "trivia": ["Famous for its technology and food"]
    }
  ]
  ```

#### **GET** `/api/destinations/random`
- **Description:** Retrieve one random destination for quiz questions.
- **Response:**
  - **200 OK**
  ```json
  {
    "_id": "destination_id",
    "city": "Paris",
    "clues": ["City of Light"],
    "fun_fact": ["Known for its art, fashion, and culture"],
    "trivia": ["Home to the Eiffel Tower"]
  }
  ```
  - **404 Not Found** if no destination available

## Future Enhancements

### Authentication & Security
- Implement JWT-based authentication
- Add password protection for user accounts
- Enable OAuth login (Google, Facebook)
- Add rate limiting for API endpoints
- Implement session management

### Quiz Features
- Add difficulty levels (Easy, Medium, Hard)
- Implement different question types (Multiple choice, True/False)
- Add timer for each question
- Include image-based questions
- Allow users to create custom quizzes
- Add hints system with point deduction

### User Experience
- Add dark/light theme toggle
- Add animations for score milestones

### Social Features
- Add global leaderboard
- Implement friend system
- Add achievements/badges
- Create weekly/monthly challenges

### Mobile Experience
- Optimize for different screen sizes

### Backend Improvements
- Add WebSocket support for real-time features
- Implement horizontal scaling

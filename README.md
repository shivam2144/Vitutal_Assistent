# 🎙️ Virtual Assistant

A voice-enabled AI assistant powered by Google's Gemini AI, built with React and Node.js. Features voice recognition, text-to-speech, and intelligent command processing for web searches, application control, and general queries.

![Virtual Assistant](https://img.shields.io/badge/AI-Gemini%202.0-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

## ✨ Features

- 🎤 **Voice Recognition**: Speak commands naturally using Web Speech API
- 🔊 **Text-to-Speech**: AI responses with customizable voice output
- 🤖 **Gemini AI Integration**: Powered by Google's Gemini 2.0 Flash model
- 🔍 **Smart Command Processing**: 
  - Google searches
  - YouTube searches and video playback
  - Application launching (VS Code, Instagram, Facebook, WhatsApp, etc.)
  - Time, date, and weather information
  - Calculator and general queries
- 👤 **User Authentication**: Secure JWT-based authentication
- 🎨 **Customizable Assistant**: Choose avatar and name for your assistant
- 📱 **Responsive Design**: Built with Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React** 19.1.0
- **Vite** 7.0.0
- **Tailwind CSS** 4.1.11
- **React Router DOM** 7.6.3
- **Axios** for API calls
- **React Icons** for UI elements

### Backend
- **Node.js** with Express 5.1.0
- **MongoDB** with Mongoose 8.16.1
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads
- **Google Gemini API** for AI responses
- **bcryptjs** for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Google Gemini API key
- Cloudinary account (for image uploads)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/shivam2144/Vitutal_Assistent.git
cd Vitutal_Assistent
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Backend** (from backend directory):
```bash
npm run dev
```
Server runs on `http://localhost:8000`

**Frontend** (from frontend directory):
```bash
npm run dev
```
App runs on `http://localhost:5173`

## 🎯 Usage

1. **Sign Up**: Create a new account
2. **Customize**: Choose an avatar and name for your assistant
3. **Start Speaking**: Click the microphone icon and speak your command
4. **Available Commands**:
   - "Google search [query]" - Search on Google
   - "YouTube search [query]" - Search on YouTube
   - "What time is it?" - Get current time
   - "What's the date?" - Get current date
   - "Open VS Code" - Launch VS Code
   - "Open calculator" - Open calculator
   - Ask any general question for AI response

## 📂 Project Structure

```
virtual_Asssistant/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   └── gemini.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Card.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Customize.jsx
│   │   │   └── Customize2.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### User
- `GET /api/user/current` - Get current user info
- `POST /api/user/asktoassistant` - Send command to AI assistant
- `POST /api/user/customize` - Update assistant customization

## 🌐 Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Shivam Dalve**

- GitHub: [@shivam2144](https://github.com/shivam2144)
- Repository: [Virtual Assistant](https://github.com/shivam2144/Vitutal_Assistent)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses
- Web Speech API for voice recognition
- Cloudinary for image hosting
- MongoDB Atlas for database hosting

## 📞 Support

For support, email your concerns or open an issue in the GitHub repository.

---

Made with ❤️ by Shivam Dalve

# 🩺 MediMirror V3 - AI Medical Diagnostic Assistant

A premium, production-ready medical diagnostic chatbot with stunning glassmorphism UI, interactive body mapping, and AI-powered consultations.

![MediMirror](https://img.shields.io/badge/version-3.0.0-blue)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Premium Glassmorphism UI** - Modern, clean, and professional design
- 🫀 **Ultra-Realistic Human Anatomy** - Interactive SVG body map with detailed organs
- 🤖 **AI-Powered Diagnosis** - GitHub Models API (GPT-4o) integration
- 💬 **Conversational Interface** - Natural medical consultation flow
- 📊 **Comprehensive Reports** - Detailed diagnosis with recommendations
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🔒 **Secure Backend Proxy** - No API keys in frontend
- ⚡ **Smooth Animations** - Professional transitions and effects
- 🔍 **Zoom & Pan** - Touch-optimized body map interactions
- 📥 **Export Reports** - Download diagnostic summaries

## 🏗️ Architecture

```
medimirror/
├── client/          # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/       # Route components
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # State management
│   │   ├── services/    # API integration
│   │   └── utils/       # Helper functions
│   └── ...
└── server/          # Express backend
    ├── routes/      # API endpoints
    ├── middleware/  # Rate limiting, errors
    ├── services/    # GitHub AI integration
    └── ...
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- GitHub Personal Access Token ([Get one here](https://github.com/settings/tokens))

### Installation

#### 1. Clone and Setup Backend

```bash
# Create server directory
mkdir medimirror && cd medimirror
mkdir server && cd server

# Initialize package.json (copy from artifacts)
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN

# Create folder structure
mkdir routes middleware services

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Setup Frontend

```bash
# From project root, create client directory
cd ..
mkdir client && cd client

# Copy package.json and install
npm install

# Create .env.development
cp .env.development.example .env.development

# Create folder structure
mkdir -p src/{pages,components,context,services,utils}

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
GITHUB_TOKEN=your_github_token_here
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=15
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MediMirror
VITE_APP_VERSION=3.0.0
```

## 📝 Usage

### 1. Begin Assessment
- Click "Begin Assessment" on home page
- Navigate to body map

### 2. Select Body Parts
- Click on interactive body diagram
- Use zoom controls for detailed selection
- Pan by dragging when zoomed
- Continue to consultation

### 3. AI Consultation
- Answer 4-6 AI-generated questions
- Conversational medical interview
- Real-time symptom analysis

### 4. View Diagnosis
- Comprehensive diagnostic report
- Primary diagnosis with confidence score
- Differential diagnoses
- Recommendations and red flags
- Home care instructions
- Export report as text file

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` → `#06b6d4`
- **Success Green**: `#10b981`
- **Warning Amber**: `#f59e0b`
- **Error Red**: `#ef4444`
- **Gradients**: Multiple vibrant gradient combinations

### Components
- Glassmorphism cards with backdrop blur
- Animated borders with gradient flow
- Smooth transitions and hover effects
- Responsive grid layouts
- Custom scrollbars

## 🔐 Security Features

- ✅ Backend API proxy pattern
- ✅ Rate limiting (15 requests/min)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ No API keys in frontend
- ✅ Error handling without stack traces

## 📊 API Endpoints

### POST /api/chat
Send chat message to AI
```json
{
  "messages": [{"role": "user", "content": "..."}],
  "systemPrompt": "...",
  "conversationId": "uuid"
}
```

### POST /api/diagnosis
Generate comprehensive diagnosis
```json
{
  "conversationHistory": [...],
  "bodyParts": ["Head", "Chest"]
}
```

### GET /api/health
Check AI service health

## 🧪 Testing Checklist

- [ ] Body part selection (mouse + touch)
- [ ] Zoom and pan functionality
- [ ] Chat message flow
- [ ] AI response handling
- [ ] Error scenarios
- [ ] Mobile responsiveness
- [ ] Rate limiting
- [ ] Report export
- [ ] Navigation flow

## 🚀 Deployment

### Backend (Node.js)

Deploy to: Heroku, Railway, Render, or any Node.js hosting

```bash
cd server
npm run build  # If needed
npm start
```

Set environment variables on hosting platform.

### Frontend (React)

Deploy to: Vercel, Netlify, or any static hosting

```bash
cd client
npm run build
# Upload dist/ folder to hosting
```

Update `VITE_API_URL` to production backend URL.

## 📦 Build for Production

```bash
# Backend
cd server
NODE_ENV=production npm start

# Frontend
cd client
npm run build
```

## 🐛 Troubleshooting

### Backend won't start
- Check `GITHUB_TOKEN` is set in `.env`
- Verify port 5000 is available
- Check Node.js version >= 18

### Frontend can't connect
- Verify backend is running
- Check `VITE_API_URL` in `.env.development`
- Check CORS settings in backend

### AI not responding
- Verify GitHub token is valid
- Check rate limit hasn't been exceeded
- Verify internet connection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## ⚠️ Medical Disclaimer

**IMPORTANT**: MediMirror is an AI-powered tool for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- GitHub Models API for AI capabilities
- Lucide React for beautiful icons
- Tailwind CSS for utility-first styling
- React Router for navigation

## 📞 Support

- **Email**: support@medimirror.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/medimirror/issues)
- **Docs**: [Documentation](https://docs.medimirror.com)

---

**Built with ❤️ for better healthcare**

Version 3.0.0 | Last Updated: November 2025
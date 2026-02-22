<p align="center">
  <img src="./public/logo.png" alt="Fit Track Pro" width="120" />
</p>

<h1 align="center">Fit Track Pro</h1>

<p align="center">
  <strong>AI-Powered Gym Management System</strong><br>
  A full-stack web application for managing gyms, members, trainers, and AI-powered fitness coaching.
</p>

<p align="center">
  <a href="https://ai-powered-gym-managment-system.vercel.app/">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠️ Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a>
</p>

---

## ✨ Features

### 🏢 Multi-Role Dashboard System

| Role | Capabilities |
|------|-------------|
| **Super Admin** | Manage all gyms, approve owner registrations, view system-wide analytics, user management |
| **Gym Owner** | Dashboard with revenue/member stats, manage members & trainers, approve join requests, billing |
| **Trainer** | View assigned members, manage schedules, AI coaching assistant |
| **Member** | Personal dashboard, AI workout & diet plans, fitness profile, view bills & receipts |

### 🤖 AI-Powered Features (Hugging Face Integration)

- **AI Workout Plan Generator** — Personalized weekly workout plans based on user profile (age, weight, goal, experience)
- **AI Diet Plan Generator** — Custom meal plans with macro breakdowns
- **AI Fitness Coach Chat** — Interactive chat for fitness Q&A (FitBot)
- **AI Business Assistant** — Revenue insights & growth advice for gym owners (BizBot)
- **AI Trainer Coach** — Science-based training advice for trainers (CoachBot)
- **BMI Calculator** — Auto-calculated with category classification
- **Macro Calculator** — Daily calories, protein, carbs, fat, water intake

### 🔐 Authentication & Security

- Firebase Authentication (Email/Password)
- Email Verification via Firebase Auth
- Phone OTP Verification (Firebase Realtime DB)
- Role-based access control
- Super Admin protected routes
- Pending request approval workflow

### 💼 Business Features

- **Member Management** — Add, edit, remove members with full profiles
- **Trainer Management** — Assign trainers to gyms, manage specializations
- **Billing System** — Create bills, generate receipts, track payments
- **Join Requests** — Members & trainers request to join gyms, owners approve/reject
- **Trainer Scheduling** — Manage trainer availability and assignments

### 🎨 UI/UX

- Modern dark theme with glassmorphism effects
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations & micro-interactions
- Toast notifications for all actions
- Loading states & skeleton screens

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Build Tool** | Vite 5 |
| **Authentication** | Firebase Auth |
| **Database** | Firebase Realtime Database |
| **AI/ML** | Hugging Face Inference API (via serverless proxy) |
| **Serverless** | Vercel Serverless Functions |
| **Hosting** | Vercel |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts (Inter, Outfit) |

---

## 📁 Project Structure

```
fit-track-pro/
├── api/                        # Vercel Serverless Functions
│   ├── ai-proxy.js             # AI proxy (Hugging Face API)
│   └── send-otp.js             # OTP generation & verification
├── public/
│   └── logo.png                # App logo
├── src/
│   ├── components/
│   │   ├── toast.js            # Toast notification system
│   │   └── theme-toggle.js     # Dark/light theme toggle
│   ├── config/
│   │   └── firebase.js         # Firebase configuration
│   ├── js/
│   │   ├── auth.js             # Authentication utilities
│   │   ├── utils.js            # Helper functions
│   │   └── otp-utils.js        # OTP generate/verify via Firebase
│   ├── services/
│   │   ├── ai-service.js       # AI API service layer
│   │   └── fitness-engine.js   # BMI, macro, calorie calculations
│   └── styles/
│       ├── variables.css       # CSS custom properties
│       ├── base.css            # Reset & base styles
│       ├── components.css      # Reusable component styles
│       ├── auth.css            # Auth page styles
│       ├── dashboard.css       # Dashboard layout styles
│       └── main.css            # Style aggregator
├── index.html                  # Landing page
├── login.html                  # Login page
├── role.html                   # Role selection
├── forgot-password.html        # Password reset
├── owner-signup.html           # Owner registration + OTP
├── member-signup.html          # Member registration + OTP
├── trainer-signup.html         # Trainer registration + OTP
├── owner-dashboard.html        # Owner dashboard
├── member-dashboard.html       # Member dashboard
├── trainer-dashboard.html      # Trainer dashboard
├── superadmin-dashboard.html   # Super admin dashboard
├── superadmin-gyms.html        # Gym management (admin)
├── superadmin-users.html       # User management (admin)
├── superadmin-login.html       # Admin login
├── member-ai.html              # AI fitness coach (member)
├── owner-ai.html               # AI business assistant (owner)
├── trainer-ai.html             # AI coaching assistant (trainer)
├── manage-members.html         # Member management (owner)
├── manage-trainers.html        # Trainer management (owner)
├── manage-requests.html        # Join request approval
├── add-member.html             # Add member form
├── assign-trainer.html         # Assign trainer to gym
├── create-bill.html            # Billing form
├── view-receipts.html          # Receipt viewer
├── edit-profile.html           # Profile editor
├── trainer-schedule.html       # Trainer scheduling
├── database.rules.json         # Firebase security rules
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel deployment config
└── package.json                # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Firebase Project](https://console.firebase.google.com/) with Auth & Realtime Database enabled
- [Hugging Face API Token](https://huggingface.co/settings/tokens) (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/tannuup123/AI-powered-GYM-Managment-System.git
cd AI-powered-GYM-Managment-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Hugging Face AI
HUGGINGFACE_TOKEN=hf_your_token_here
```

### 4. Firebase Database Rules

Deploy the security rules to your Firebase project:

```bash
# Via Firebase Console → Realtime Database → Rules
# Copy contents of database.rules.json
```

### 5. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the following environment variables in Vercel Dashboard:
- All `VITE_FIREBASE_*` variables
- `HUGGINGFACE_TOKEN`

---

## 🔑 User Roles & Access

### Super Admin
- **Login:** Separate login at `/superadmin-login.html`
- **Powers:** Full system access, approve gym owners, manage all users

### Gym Owner
- **Signup:** Register at `/owner-signup.html` (requires email + phone verification)
- **Approval:** Must be approved by Super Admin before gaining access
- **Powers:** Manage own gym, members, trainers, billing

### Member
- **Signup:** Register at `/member-signup.html` (requires email + phone verification)
- **Approval:** Must be approved by respective Gym Owner
- **Powers:** View dashboard, use AI coach, track fitness

### Trainer
- **Signup:** Register at `/trainer-signup.html` (requires email + phone verification)
- **Approval:** Must be approved by respective Gym Owner
- **Powers:** View members, manage schedule, use AI assistant

---

## 🤖 AI Integration

The AI features use **Hugging Face's Inference API** through a Vercel serverless proxy (`/api/ai-proxy.js`) to avoid CORS issues and protect API keys.

### Supported AI Models
- Text generation for workout plans, diet plans, and chat responses
- Robust JSON parser with auto-fix for trailing commas, truncated responses, and malformed output

### AI Features by Role

| Feature | Member | Trainer | Owner |
|---------|--------|---------|-------|
| Workout Plan Generator | ✅ | ❌ | ❌ |
| Diet Plan Generator | ✅ | ❌ | ❌ |
| Fitness Coach Chat | ✅ | ❌ | ❌ |
| Training Assistant | ❌ | ✅ | ❌ |
| Business Assistant | ❌ | ❌ | ✅ |

---

## 📊 Database Structure

```
firebase-realtime-db/
├── owners/                 # Gym owner profiles
│   └── {ownerId}/
│       ├── members/        # Gym members
│       └── bills/          # Billing records
├── trainers/               # Trainer profiles
├── trainer_schedules/      # Trainer availability
├── members/                # Member profiles
├── bills/                  # All bills
├── pending_requests/       # Signup approval queue
├── fitness_profiles/       # AI fitness data
├── otp_verifications/      # Phone OTP records
└── superadmins/            # Admin UIDs
```

---

## 🔒 Security

- All API keys stored as environment variables (never exposed client-side)
- Firebase security rules enforce role-based read/write access
- Email verification required before signup
- Phone OTP verification required before signup
- Pending request approval prevents unauthorized access
- Serverless proxy protects AI API tokens

---

## 📄 License

This project is built for educational purposes.

---

<p align="center">
  Built with ❤️ using Firebase, Vite & AI
</p>

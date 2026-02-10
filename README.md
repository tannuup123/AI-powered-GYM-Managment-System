# 🏋️‍♂️ FitTrack Pro - AI-Powered Gym Management System

![FitTrack Pro Banner](https://img.shields.io/badge/Status-Production%20Ready-success)
![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![AI Power](https://img.shields.io/badge/AI-Llama%203%208B-blue?logo=huggingface)

FitTrack Pro is a modern, comprehensive **Gym Management System** enhanced with **Artificial Intelligence**. It provides specialized dashboards for **Members, Gym Owners, and Trainers**, integrating traditional management tools (billing, attendance, member tracking) with cutting-edge AI features (workout generation, diet planning, business insights).

🔗 **Live Demo:** [https://ai-powered-gym-managment-system.vercel.app/](https://ai-powered-gym-managment-system.vercel.app/)

---

## 🚀 Key Features

### 🤖 AI-Powered Capabilities (New!)
*   **For Members (FitBot):**
    *   **AI Workout Generator**: Creates personalized weekly workout plans based on age, weight, and goals.
    *   **AI Diet Planner**: Generates meal plans tailored to dietary preferences (Veg/Non-Veg) and budget.
    *   **Fitness Chat**: Context-aware AI assistant for fitness queries.
*   **For Owners (BizBot):**
    *   **Business Insights**: AI analyzes financial data to provide actionable strategies for revenue growth.
    *   **Performance Tracking**: Predictive analytics for member retention.
*   **For Trainers (CoachBot):**
    *   **Client Analysis**: Automated ongoing assessment of assigned members.
    *   **Training Suggestions**: AI-driven recommendations for client programming.

### 🛠️ Core Management Features
*   **Role-Based Access Control**: Secure login for Super Admin, Admin (Owner), Trainer, and Member.
*   **Member Management**: Add, edit, and track members.
*   **Billing & Finance**: Invoice generation, payment tracking, and receipt management.
*   **Attendance System**: Daily check-in/out tracking.
*   **Trainer Scheduling**: Shift management and client assignment.

---

## 🏗️ Tech Stack

*   **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+), Vite
*   **Backend / Database**: Google Firebase (Auth, Realtime Database)
*   **AI Engine**: Hugging Face Inference API (Meta Llama 3 8B Instruct)
*   **Proxy Server**: Vercel Serverless Functions (Node.js) to handle CORS and API security.
*   **Deployment**: Vercel

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/fit-track-pro.git
    cd fit-track-pro
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your keys:
    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id

    # AI Configuration (Hugging Face)
    VITE_HUGGING_FACE_TOKEN=hf_your_hugging_face_token
    ```

4.  **Run Locally**
    Since this project uses a serverless proxy for AI, use `vercel dev` instead of `npm run dev`:
    ```bash
    npx vercel dev
    ```
    *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📂 Project Structure

```
fit-track-pro/
├── api/                # Vercel Serverless Functions
│   └── ai-proxy.js     # AI API Proxy (CORS handler)
├── src/
│   ├── js/             # Core Logic (Auth, Utils)
│   └── services/       # Service Layers
│       ├── ai-service.js       # AI Integration
│       └── fitness-engine.js   # Rule-based Engine
├── public/             # Static Assets
├── *.html              # Application Pages
├── vercel.json         # Deployment Config
└── ...
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

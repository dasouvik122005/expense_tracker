# Expense Tracker

A modern, dynamic expense tracking application built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo
**Check out the live application here:** [https://expansetracker1210.netlify.app/](https://expansetracker1210.netlify.app/)

## ✨ Features
- Track your daily expenses and income effortlessly.
- View detailed breakdowns and insights using charts (Powered by Recharts).
- Modern, responsive, and beautiful user interface.
- Smooth animations and transitions.
- Cross-platform support (Includes Capacitor for Android).
- AI-powered features using Gemini AI.

## 🛠 Tech Stack
- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Animations:** Motion
- **Mobile Support:** Capacitor
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   (If you haven't already downloaded the project files)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   If you have an `.env.example` file, copy it to `.env.local` and add your required keys (e.g., `GEMINI_API_KEY`).
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app should now be running locally.

## 📦 Build for Production
To build the application for production deployment:
```bash
npm run build
```

## 📱 Android Development
To run or build the Android version using Capacitor:
```bash
npx cap sync android
npx cap open android
```

## 🔮 Future Plans

- 📊 Advanced Analytics Dashboard  
  Add deeper financial insights like spending trends, category-wise predictions, and monthly comparisons with AI-driven recommendations.

- 🤖 Smarter AI Integration (Gemini Upgrade)  
  Enhance AI capabilities with:
  - Automatic expense categorization  
  - Personalized saving suggestions  
  - Natural language queries (e.g., "How much did I spend on food last month?")

- 🔔 Smart Notifications & Reminders  
  Implement alerts for:
  - Budget limits  
  - Unusual spending patterns  
  - Bill payment reminders  

- 👥 User Authentication & Cloud Sync  
  Add secure login (Google/email) and cloud storage to sync data across multiple devices.

- 📱 Full Mobile Optimization  
  Improve mobile experience by:
  - Converting into a Progressive Web App (PWA)  
  - Exploring dedicated mobile app development (React Native / Flutter)

- 💰 Budget Planning System  
  Allow users to:
  - Set monthly budgets  
  - Track remaining balance  
  - Get real-time overspending alerts  

- 📂 Export & Reports  
  Enable downloading reports in:
  - PDF  
  - CSV / Excel  

- 🌐 Multi-Currency & Localization  
  Add support for:
  - Multiple currencies  
  - Regional formats  
  - Multiple languages  

- 🔐 Data Security Enhancements  
  Improve security with:
  - Encrypted data storage  
  - Secure API handling  
  - Better environment variable management  

- ⚡ Performance Optimization  
  Enhance performance through:
  - Lazy loading components  
  - Optimized chart rendering  
  - Efficient state management  
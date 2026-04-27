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

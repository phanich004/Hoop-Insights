# Hoops Insights


<img width="1386" alt="Screenshot 2025-06-23 at 2 53 36 AM" src="https://github.com/user-attachments/assets/6d12b47b-bf61-4d03-8d0d-aaf5e4e9a15e" />

## Overview

**Hoop Insights** is a web application that leverages AI to analyze basketball game footage. Upload your game video and receive:
- The number of baskets scored
- An analysis of your strengths and weaknesses
- A play-by-play commentary as if from a sports commentator

## Features
- 📹 **Video Upload:** Upload basketball game videos (max 50MB)
- 🤖 **AI Analysis:** Counts baskets, analyzes performance, and generates commentary using Google Gemini AI
- 📊 **Performance Feedback:** Get strengths, weaknesses, and actionable insights
- 🖥️ **Modern UI:** Responsive design with toast notifications and smooth user experience

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Radix UI, Lucide Icons
- **AI:** Genkit (Google Gemini)
- **Validation:** Zod
- **Other:** PostCSS, custom fonts (Inter, Space Grotesk)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Development
Start the Next.js app (UI):
```bash
npm run dev
```

Start the Genkit AI server (for video analysis):
```bash
npm run genkit:dev
```

- The Next.js app runs on [http://localhost:9002](http://localhost:9002)
- The Genkit server powers the AI analysis features

### Build for Production
```bash
npm run build
npm start
```

### Lint & Type Check
```bash
npm run lint
npm run typecheck
```

## Usage
1. Open the app in your browser.
2. Upload a basketball game video (max 50MB).
3. Click **Analyze Gameplay**.
4. View the AI-generated basket count, analysis, and commentary.

## Configuration
- **AI:** Configured in `src/ai/genkit.ts` to use Google Gemini via Genkit.
- **Styling:** Tailwind CSS with custom configuration in `tailwind.config.ts`.
- **No direct Firebase usage detected in the codebase.**

## License
MIT

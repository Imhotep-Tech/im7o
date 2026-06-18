# Im7o (إيمحو) - The Ultimate Party Games Platform 𓋹

The **Im7o** platform is an open-source Party Games platform that allows anyone to invent and add their own games.
The platform acts as a **Custom Git-Backed Serverless App**: Any game added to the GitHub repository automatically becomes available to all players. We have completely eliminated the need for a backend server or database!

## Key Features 🌟

- **Offline Mode (العمل دون اتصال)**: The app works as a Progressive Web App (PWA), meaning you can play smoothly in places without internet, with game content updating automatically in the background.
- **Bilingual i18n (نظام ثنائي اللغة)**: The platform's UI supports both Arabic and English with Runtime Switching to expand the base of players and content creators.
- **Egyptian Aesthetic UI (تصميم فرعوني ديناميكي)**: Elegant interfaces with sophisticated visual effects inspired by Egyptian antiquities, featuring golden touches and micro-animations that bring the gaming experience to life.
- **Interactive Landing Page**: A welcoming page that explains how the platform works with smooth navigation to start playing or explore the source code.
- **Multiple Game Engines (محركات ألعاب متعددة)**: The platform has an advanced **Engines** system that allows for various gameplay mechanics:
  - `Classic`: Turn-based text challenges.
  - `MCQ / Trivia`: Question and Answer with elegant grid options.
  - `Taboo`: Forbidden words (displays the word to guess along with a list of forbidden words).
  - `Hot Potato`: (البطاطس الساخنة) Pass the phone with an accelerating bomb timer.
  - `Imposter / Spyfall`: (الجاسوس) Pass the phone to see secret roles, then interrogate.
- **Zero Hosting Costs (Serverless)**: No backend is needed! The frontend reads the JSON files directly, creating an infinitely scalable architecture.
- **Easy Contribution**: Submit games directly via GitHub Pull Requests or easily format them via our UI email generator.

---

## 🛠️ Architecture (كيف تعمل المنصة؟)

The project consists of a purely static frontend:
- **Frontend (Next.js)**: The main UI, including play screens, the Engine dispatcher, PWA, and dashboards. It statically exports and reads games directly from JSON files in `src/data/games/` and `src/data/cards/`.

---

## 🤝 Contributing (المساهمة في المشروع)

We highly welcome your contributions! We have divided the contribution guidelines to make it easier:

### 1. Contributing Games (For Content Creators & Authors)
You can contribute and add games in two ways:
- **Via GitHub (Highly Recommended! - موصى به جداً!)**: If you know how to handle JSON files and Pull Requests, we highly recommend adding your creations directly via our GitHub repository. You will have 100% control, your edits will be processed instantly, and you will get an official Contributor badge in the project!
- **Via Email**: You can use our Creator Dashboard to fill out a beautiful form that will generate an email containing your game details, which you can then send to us for manual review.

👉 **[Read the full guide for adding games here (CONTRIBUTING-GAMES.md)](./docs/CONTRIBUTING-GAMES.md)**

### 2. Code Contributions (For Developers)
If you want to develop a new game Engine with an innovative idea, or improve the current platform interfaces, we would be absolutely thrilled!

👉 **[Read the full code contribution guide here (CONTRIBUTING-CODE.md)](./docs/CONTRIBUTING-CODE.md)**

---

## 🚀 Local Development (تشغيل المشروع محلياً)

### Requirements
- Node.js (for Frontend)

### Running the App
1. Clone the repository and install dependencies (`npm install`).
2. Run the platform via `npm run dev`.
3. Open `http://localhost:3000` in your browser.

---

Coded with passion 🚀. We look forward to seeing your creations!

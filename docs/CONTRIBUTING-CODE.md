# Code Contribution Guide (دليل المساهمة البرمجية)

Thank you for your interest in contributing to the **Im7o** project! We welcome all contributions from developers, whether it's bug fixes, performance improvements, or adding new features and game engines.

## 🛠️ Local Setup (إعداد بيئة التطوير)

To start working on the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Imhotep-Tech/im7o.git
   cd im7o
   ```
2. **Install Dependencies**: The project requires Node.js.
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

## 📂 Project Structure (هيكل المشروع)

The project is built using **Next.js (App Router)** and **Tailwind CSS**. The main structure is as follows:

- `/src/app`: Contains the main page routes:
  - `(home)`: The game selection interface.
  - `/creator`: The Creator Dashboard for learning how to submit games.
  - `/game/[id]`: The main Game Dispatcher (`GameDispatcher`) that renders the appropriate engine.
- `/src/engines`: Contains the various game Engines that manage the logic for each game type (e.g. `TurnBasedEngine`, `McqEngine`).
- `/src/components`: Reusable components (e.g. `PortalNav`, `Timer`, `InstructionsModal`).
- `/src/hooks`: Custom Hooks (e.g. `useGameEngine` to manage unified game states).
- `/src/utils`: General helper functions (e.g. `gameUtils.ts`).
- `/src/data`: Contains the JSON files for the games (`games/`) and their attached cards (`cards/`).

## 🚀 Adding a New Engine Template (إضافة محرك ألعاب جديد)

If you have an idea for a completely new gameplay style, you can program a new Engine by following these steps:

1. **Create the Engine Component**:
   Create a new file in `src/engines/` (e.g. `MyNewEngine.tsx`). It is recommended that the new engine relies on the `BaseEngineLayout` template if it fits the general design, and uses `useGameEngine` to manage turns and scores.
2. **Register the Engine**:
   Open `src/engines/GameDispatcher.tsx`, import your new engine, and add it to the Switch Case based on `config.engineTemplate`.
3. **Update the Creator Dashboard**:
   If the new engine requires a different card structure (e.g. requires images or 4 options instead of 2), you can update the email generator form in `src/app/creator/page.tsx` to handle this format.

## 💻 Coding Standards (معايير كتابة الكود)

To ensure code quality and maintainability, please adhere to the following standards:

- **TypeScript**: Use `TypeScript` to strictly type your variables (Types/Interfaces). Avoid using `any` as much as possible.
- **Styling**: Use **Tailwind CSS** exclusively. Avoid writing custom CSS in external files unless absolutely necessary.
- **UI Components**: Make your UI components (like buttons, cards) reusable and place them in `src/components/`.
- **Separation of Concerns**: Separate complex logic from the graphical interface using Hooks in `src/hooks/` or helper functions in `src/utils/`.

## 📝 Commit Messages (قواعد رسائل الالتزام)

We use [Conventional Commits](https://www.conventionalcommits.org/) to maintain clear changes:
- `feat: add a new feature` (e.g. `feat: add new imposter engine`)
- `fix: fix a bug` (e.g. `fix: timer not stopping on elimination`)
- `docs: update documentation` (e.g. `docs: update code contribution guidelines`)
- `style: formatting or visual tweaks` (no logic changes)
- `refactor: code refactoring` (improving code without adding features or fixing bugs)

## 🔄 Pull Request (إرسال التعديلات)

1. Make sure the code works locally without errors.
2. **Fork** the repository if you haven't already.
3. Create a new branch for your feature: `git checkout -b feature/my-awesome-feature`
4. Commit your changes while following the message rules.
5. Push the changes: `git push origin feature/my-awesome-feature`
6. Go to Github and create a **Pull Request**, detailing what you have added or fixed.

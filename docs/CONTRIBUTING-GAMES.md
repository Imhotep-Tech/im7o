# Games Contribution Guide (دليل إضافة الألعاب)

You can contribute and add new games to the **Im7o** platform either via a **Github Pull Request** (highly recommended) or by submitting a formatted **Email** through our Creator Dashboard.

## Method 1: Add a game manually via Github (Highly Recommended!) 🛠️

If you are a developer and prefer writing JSON files yourself, you can create a Pull Request directly on Github. This gives you 100% control, is processed much faster, and gets you an official Contributor Badge!

### Step 1: Create the game configuration file
Inside the `src/data/games/` directory, create a file named after your game (e.g. `my-cool-game.json`):

```json
{
  "id": "my-cool-game",
  "title": "My Awesome Game (لعبتي الرهيبة)",
  "author": "Your Name",
  "mode": "individual",
  "engineTemplate": "classic",
  "turnStrategy": "open",
  "themeColor": "#FF5733",
  "logo": "🔥",
  "hasTimer": true,
  "defaultTimerSeconds": 30,
  "isTimerCustomizable": true,
  "allowElimination": false,
  "instructions": "How to play goes here...",
  "cardsFile": "my-cool-game-cards.json"
}
```

### Configuration Properties Explanation:

- **`id`**: A unique identifier for the game in English without spaces (use `-` instead).
- **`title`**: The game name that will appear to players (can be in Arabic).
- **`author`**: The name of the game creator/developer.
- **`mode`**: Play mode. Options:
  - `individual`: Individual mode (every person for themselves).
  - `multi-team`: Multi-team mode (playing in teams).
- **`engineTemplate`**: The engine type used for the game. Options:
  - `classic`: Turn-based classic texts.
  - `mcq`: Question and Answer (requires cards formatted with `question`, `options`, and `answer`).
  - `hot-potato`: Pass the phone before it explodes.
  - `taboo`: Forbidden words (requires cards formatted with `word` and `forbidden`).
  - `imposter`: Spyfall/Imposter (locations and spies).
- **`turnStrategy`**: The answering/turn system (usually used with `classic`, `mcq`, `taboo`). Options:
  - `sequential`: By turn (a specific person or team answers).
  - `open`: Open format (the question is for everyone, fastest to answer gets the point).
- **`themeColor`**: The theme color in HEX format (e.g. `#FF5733`).
- **`logo`**: The game logo/icon, preferably an emoji (e.g. 🔥, 💣).
- **`hasTimer`**: Does the game have a timer? (`true` or `false`).
- **`defaultTimerSeconds`**: The default time in seconds for a single turn (if `hasTimer` is `true`).
- **`isTimerCustomizable`**: Can players change the timer before the game starts? (`true` or `false`).
- **`allowElimination`**: Enable the elimination system where losing players get kicked out (`true` or `false`).
- **`instructions`**: The instructions and rules that will appear to players before starting.
- **`cardsFile`**: The name of the cards file for this game (e.g. `my-cool-game-cards.json`).

### Step 2: Create the cards file
Inside the `src/data/cards/` directory, create a file matching the `cardsFile` property (e.g. `my-cool-game-cards.json`). The format differs based on the chosen engine:

**If the engine is Classic, Hot Potato, or Imposter (Array of strings):**
```json
[
  "Challenge 1",
  "Challenge 2",
  "School"
]
```

**If the engine is MCQ (Question and Answer):**
```json
[
  {
    "question": "ما هي عاصمة مصر؟",
    "options": ["القاهرة", "الإسكندرية", "أسوان", "الأقصر"],
    "answer": "القاهرة"
  }
]
```

**If the engine is Taboo (Forbidden words):**
```json
[
  {
    "word": "تفاحة",
    "forbidden": "أحمر, فاكهة, شجرة"
  }
]
```

### Step 3: Create a Pull Request
Push both files in the same commit, and create a Pull Request to be reviewed and merged into the main platform!

---

## Method 2: Submitting via Email 📧

If you do not want to use GitHub, you can use our Creator Dashboard in the app.
1. Open the Im7o app and click on **Add Game** (or navigate to `/creator`).
2. Select the **Email Submission Tab**.
3. Fill in the form with your game's details and cards.
4. Click Submit. This will automatically format your game correctly and open your default email client so you can send it to us for manual addition!

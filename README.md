# 🌟 Monkey Maze Game 🐒

A playful, interactive browser-based maze game! Help the happy little monkey navigate through dynamically generated mazes to reach the delicious banana, complete with confetti celebrations on victory!

---

## ✨ Features

- **Procedural Maze Generation**: Uses the Recursive Backtracker algorithm to generate fresh, unique mazes every round.
- **Dual Controls**:
  - **Touch & Mouse Tracing**: Draw paths directly onto the maze grid with your finger or mouse. Backtracking smoothly erases the path.
  - **On-Screen D-Pad**: Tap directional arrow buttons (⬆️ ⬇️ ⬅️ ➡️) for step-by-step navigation.
- **Victory Celebration**: Confetti animation powered by `canvas-confetti` when the monkey reaches the goal.
- **Game Controls**: "Restart" current maze or generate a "New Maze" at any time.
- **Responsive Design**: Designed to play smoothly on both desktop and mobile devices.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:ImaginationStationLafayette/monkey-maze-game.git
   cd monkey-maze-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the local URL provided by Vite (e.g. `http://localhost:5173`) in your browser.

---

## 🛠️ Built With

- **HTML5 & CSS3** — Responsive layout, custom styling, and grid-based maze rendering.
- **Vanilla JavaScript** — Maze generation algorithms, touch & mouse drawing, and game state management.
- **Vite** — Fast, lightweight local development server and bundler.
- **canvas-confetti** — Celebration effects on completing the maze.

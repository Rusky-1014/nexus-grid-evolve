# Nexus Grid: Evolve

Welcome to **Nexus Grid: Evolve**! This is a project I built to reimagine the classic Tic-Tac-Toe experience. I wanted to create something that feels familiar but adds a new layer of challenge, so I designed a system where the game board "evolves" and grows larger as you progress through levels.

## 🎮 How It Works

The game starts simple: a standard 3x3 grid. But here's the twist—when you win, you don't just restart. You advance to the next level, and the grid expands.

- **Level 1:** 3x3 Grid (Win with 3 in a row)
- **Level 2:** 4x4 Grid (Win with 4 in a row)
- **Level 3+:** The grid keeps growing up to 9x9! (Win with 5 in a row)

It gets pretty chaotic on the larger boards, which is exactly what I was going for.

## ✨ Features

- **Dynamic Board Sizing:** The grid automatically adjusts CSS grid templates to fit the new size.
- **Adaptive AI:** The computer player ('O') is programmed to block your winning moves and seize victory if you slip up. It's not unbeatable, but it will punish mistakes.
- **Progressive Difficulty:** Winning conditions scale with the board size.
- **Responsive Design:** Looks good on desktop and should be playable on mobile too.

## 🤖 AI Logic

The "AI" isn't a complex model but a reactive system that prioritizes:
1. **Attack:** Take a winning spot immediately.
2. **Defend:** Block the player if they are about to win.
3. **Random:** Pick a random available spot.

## 🛠️ Tech Stack

I kept it lightweight and fast, using only vanilla web technologies:
- **HTML5** for structure
- **CSS3** for the "Nexus" aesthetic and grid layouts
- **JavaScript (ES6+)** for the game logic, AI, and DOM manipulation

## 🚀 How to Run

You don't need to install anything fancy.

1. Clone this repo or download the files.
2. Open `index.html` in your browser.
3. That's it!

## 🔮 Future Plans

There are a few things I'd like to add when I have time:
- [ ] Add a "Hard Mode" with a Minimax algorithm for the AI (currently it uses a heuristic approach).
- [ ] Local multiplayer support so two humans can play on the expanding grid.
- [ ] Sound effects for moves and level-ups.

## 🤝 Contributing

If you find a bug or have an idea for a cooler winning animation, feel free to open an issue or submit a pull request. I'm always open to feedback!

---
*Enjoy the game!*

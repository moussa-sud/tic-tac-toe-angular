# Tres — A Tic-Tac-Toe Study

An editorial take on the oldest grid game in the book. Built with **Angular 17**
(standalone components), **SCSS**, and zero backend — the persistent
scoreboard lives in `localStorage`.

> *Two marks. Nine cells. Eight ways to win.*

---

## Running the game

```bash
# 1. install dependencies
npm install

# 2. start the dev server (opens http://localhost:4200)
npm start
# or, if you prefer the CLI directly:
ng serve --open

# 3. production build (outputs to dist/)
npm run build
```

Requires **Node 18.13+** and the Angular CLI (`npm i -g @angular/cli` if not
already installed). The Angular CLI is also pulled in as a dev dependency, so
`npx ng serve` works without a global install.

---

## How to play

1. **X opens the round.** Players alternate placing their mark on any empty cell.
2. A **row, column, or diagonal of three** matching marks wins the round.
3. If all nine cells fill without a line, the round is a **draw**.
4. **Restart round** clears the board and hands the opening move to the
   other player (so the X-first advantage doesn't always favor the same side).
5. The **running tally** (X wins / Draws / O wins) is persisted across
   reloads via `localStorage`. Reset it from the *Scores* page if you wish.

Cells are keyboard-accessible — tab to focus, then `Enter` or `Space` to play.

---

## Project structure

```
tic-tac-toe-angular/
├── angular.json                   Angular workspace config
├── package.json
├── tsconfig.json / tsconfig.app.json
├── README.md
└── src/
    ├── index.html                 Loads fonts + bootstraps <app-root/>
    ├── main.ts                    bootstrapApplication entry point
    ├── styles.scss                Global tokens (color, type, motion)
    ├── assets/                    Static assets (currently empty)
    └── app/
        ├── app.component.{ts,html,scss}   Root shell (header / outlet / footer)
        ├── app.config.ts          Application providers (router, etc.)
        ├── app.routes.ts          Lazy-loaded page routes
        │
        ├── core/                  Framework-agnostic domain
        │   ├── models/
        │   │   ├── cell.model.ts         Cell = Player | null
        │   │   ├── player.model.ts       Player = 'X' | 'O'
        │   │   ├── game-state.model.ts   Round snapshot
        │   │   └── score.model.ts        Persistent scoreboard
        │   └── services/
        │       ├── game.service.ts       BehaviorSubject<GameState>; win detection
        │       └── score.service.ts      localStorage-backed tally
        │
        ├── components/            Reusable building blocks
        │   ├── header/            Sticky navbar with wordmark
        │   ├── footer/            Editorial credit strip
        │   ├── button/            Reusable AppButton (primary/ghost/outline)
        │   ├── grid/              3x3 board orchestrator
        │   ├── cell/              Single cell with SVG X / O draw-in
        │   └── game-hud/          Timer + turn + score + restart
        │
        └── pages/                 Route targets
            ├── home/              Landing with the Start CTA
            ├── game/              Active play (Grid + HUD + result overlay)
            ├── score/             Persistent tally + reset
            └── not-found/         404
```

### Architecture notes

- **State** lives in `GameService` (round state) and `ScoreService` (persistent
  tally). Both expose `BehaviorSubject`-backed observables; components subscribe
  via the `async` pipe or imperative subscriptions cleaned up in `ngOnDestroy`.
- **Immutability**: every state mutation creates a new `GameState` object so
  Angular's change detection sees a true reference change.
- **Win detection**: the eight winning line index sets are defined at module
  scope and scanned after every move in `GameService.findWinningLine`.
- **Standalone components**: no `NgModule`. Each component declares its own
  `imports` for any directives it uses (`CommonModule`, `RouterLink`, etc.).
- **Routing**: lazy-loaded via `loadComponent` so each page becomes its own
  chunk. The `**` wildcard route serves the 404 page.
- **Persistence**: scoreboard stored under the key `tres.scoreboard.v1`. The
  read path is wrapped in `try/catch` so the app still works in private
  browsing modes where `localStorage` throws.

### Design system

- **Typography**: `Fraunces` (variable serif) for display, `Hanken Grotesk`
  for body, `JetBrains Mono` for tactical numbers and labels.
- **Color**: warm bone paper (`#f5f1e8`), deep ink (`#0a1428`), brand blue
  (`#1e3a8a`), terracotta accent for X (`#d96a5a`), gold for accents.
- **Motion**: cells draw in with a `stroke-dasharray` trick, the board
  stages cells in with a 40ms-per-cell delay, the result overlay
  fades+scales in, the active timer pulses.
- **Responsive**: layouts collapse cleanly down to ~360px — the HUD
  stacks, the home plate untwists, the board scales fluidly.

---

## Scripts

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm start`         | Dev server with hot reload (port 4200)    |
| `npm run build`     | Production build → `dist/tic-tac-toe-angular/` |
| `npm run watch`     | Development build with file watching      |
| `npm test`          | Karma test runner                         |

---

## License

Built as a learning artifact — use it however you like.

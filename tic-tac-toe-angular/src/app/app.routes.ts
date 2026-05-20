import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes using standalone-component `loadComponent`.
 * Splits each page into its own chunk and keeps the initial bundle small.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Tres — Tic-Tac-Toe',
  },
  {
    path: 'play',
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
    title: 'Play — Tres',
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./pages/score/score.component').then((m) => m.ScoreComponent),
    title: 'Result — Tres',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: 'Lost — Tres',
  },
];

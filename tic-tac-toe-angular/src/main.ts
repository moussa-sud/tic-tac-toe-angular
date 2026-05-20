import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Application entry point.
 * Bootstraps the standalone AppComponent with global providers (router, etc.)
 * defined in app.config.ts.
 */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));

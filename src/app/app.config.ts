import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTranslateService({
      defaultLanguage: 'en',
    }),
  ],
};

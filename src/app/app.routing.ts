import { RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppRoutes } from './app.routes';

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(AppRoutes, { useHash: true });

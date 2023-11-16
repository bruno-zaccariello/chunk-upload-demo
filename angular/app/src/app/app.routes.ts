import { Routes } from '@angular/router';
import { AppComponent } from './core/app.component';

export const routes: Routes = [
    { path: 'chunk-upload', loadChildren: () => import('./modules/chunk-upload/chunk-upload.module').then(m => m.ChunkUploadModule) }
];

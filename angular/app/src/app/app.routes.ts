import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'chunk-upload', loadChildren: () => import('./modules/chunk-upload/chunk-upload.module').then(m => m.ChunkUploadModule) },
    { path: 'debug', loadChildren: () => import('./modules/debug/debug.module').then(m => m.DebugModule) }
];

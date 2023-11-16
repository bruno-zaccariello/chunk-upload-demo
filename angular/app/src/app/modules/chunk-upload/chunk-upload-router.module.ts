import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChunkUploadHomeComponent } from './components/chunk-upload-home/chunk-upload-home.component';

const routes: Routes = [
  { path: '', loadComponent: () => ChunkUploadHomeComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChunkUploadRouterModule { }

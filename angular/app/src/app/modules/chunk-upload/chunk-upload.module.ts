import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkUploadHomeComponent } from './components/chunk-upload-home/chunk-upload-home.component';
import { ChunkUploadRouterModule } from './chunk-upload-router.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChunkUploadRouterModule,
    ChunkUploadHomeComponent
  ]
})
export class ChunkUploadModule { }
